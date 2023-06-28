import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import "./LocationDialog.css";
import imagePlaceholder from "../assets/icons/image-placeholder.png";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Map } from "./Map";
import { TextButton } from "../components/TextButton";
import LocationsService from "../api/locations.service";
import { recordInputAction } from "../helpers/actions-utility";
import { ILocation } from "../interfaces/location.interface";

interface ILocationDialogProps {
  type: "add" | "edit";
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  locationToEdit?: ILocation;
  setLocationEdited?: React.Dispatch<
    React.SetStateAction<ILocation | undefined>
  >;
}

interface ILocationFormFields {
  id: string | undefined;
  caption: string | undefined;
  location: any;
}

const schema: yup.ObjectSchema<ILocationFormFields> = yup.object({
  id: yup.string().optional(),
  caption: yup.string().optional().max(100),
  location: yup
    .mixed()
    .test("File required", "File is required", (filelist: any) => {
      if (filelist[0] === undefined) return false;

      return true;
    })
    .test(
      "File MIME type",
      "File is not of image/jpeg nor image/jpg MIME type",
      (filelist: any) => {
        if (
          filelist[0]?.type !== "image/jpeg" &&
          filelist[0]?.type !== "image/jpg"
        )
          return false;

        return true;
      }
    ),
});

export const LocationDialog: React.FC<ILocationDialogProps> = ({
  type,
  open,
  setOpen,
  locationToEdit,
  setLocationEdited,
}) => {
  const [locationCaption, setLocationCaption] = useState<string>("");

  const [locationImagePreview, setLocationImagePreview] = useState<
    Blob | string
  >(imagePlaceholder);

  const [mapCurrentCoords, setMapCurrentCoords] = useState<{
    lat: number;
    lng: number;
  }>({ lat: 0, lng: 0 });

  const [mapExposeCoords, setMapExposeCoords] = useState<{
    lat: number;
    lng: number;
  }>({ lat: 0, lng: 0 });

  const [resultDialogOpen, setResultDialogOpen] = useState<boolean>(false);

  const [operationResult, setOperationResult] = useState<string>("");

  const [operationDetails, setOperationDetails] = useState<string>("");

  const locationsService: LocationsService = new LocationsService();

  useEffect(() => {
    // editing the passed location
    if (type === "edit" && locationToEdit) {
      setLocationCaption(locationToEdit.caption);

      const streamImage: () => void = async () => {
        const image: Blob = await locationsService.streamImage(
          locationToEdit.image
        );

        setLocationImagePreview(image);
      };
      streamImage();

      setMapCurrentCoords({
        lat: parseFloat(locationToEdit.lat.toString()),
        lng: parseFloat(locationToEdit.lon.toString()),
      });

      return setMapExposeCoords({
        lat: parseFloat(locationToEdit.lat.toString()),
        lng: parseFloat(locationToEdit.lon.toString()),
      });
    }

    setLocationCaption("");

    setLocationImagePreview(imagePlaceholder);

    navigator.geolocation.getCurrentPosition((position) => {
      setMapCurrentCoords({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });

      setMapExposeCoords({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  }, [type, locationToEdit]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILocationFormFields>({ resolver: yupResolver(schema) });

  const onSubmit: SubmitHandler<ILocationFormFields> = async (
    data: ILocationFormFields
  ) => {
    setResultDialogOpen(true);

    const formData: FormData = new FormData();
    typeof data.caption === "string" &&
      formData.append("caption", data.caption);
    formData.append("image", data.location[0]);

    // creating location
    if (type === "add") {
      formData.append("lat", mapCurrentCoords.lat.toString());
      formData.append("lon", mapCurrentCoords.lng.toString());

      const result = await locationsService.createLocation(formData);

      // failed
      if (result !== "") {
        setOperationResult("Location addition failed.");

        return setOperationDetails(result);
      }

      setOperationResult("Location added.");

      return setOperationDetails("Location image was uploaded.");
    }

    // to edit
    if (type === "edit" && locationToEdit) {
      formData.append("id", locationToEdit.id);

      const result = await locationsService.editLocation(formData);

      // failed
      if (result !== "") {
        setOperationResult("Location addition failed.");

        return setOperationDetails(result);
      }

      const editedImage: string = (
        await locationsService.selectLocation(locationToEdit.id)
      ).image;

      setLocationEdited &&
        setLocationEdited({
          ...(locationToEdit as ILocation),
          image: editedImage,
        });

      setOperationResult("Location edited.");

      setOperationDetails("Location image was re-uploaded.");
    }
  };
  return (
    <Dialog id="locationAddDialog" open={open}>
      <DialogTitle>
        <span>{type === "edit" ? "Edit" : "Add"}</span> <span>location</span>
      </DialogTitle>
      <DialogContent>
        <form id="locationAddForm" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            autoFocus
            margin="dense"
            label="Hint caption"
            type="text"
            fullWidth
            variant="standard"
            color="success"
            {...register("caption", {
              value: locationCaption,
            })}
            placeholder={locationCaption}
            data-error={errors.caption ? errors.caption.message : ""}
            onBlur={recordInputAction}
          />
          <img
            loading="eager"
            id="locationPreview"
            src={
              typeof locationImagePreview === "string"
                ? locationImagePreview
                : URL.createObjectURL(locationImagePreview)
            }
            alt="preview"
          />
          <div id="locationImageUpload">
            <label id="chooseImage" htmlFor="locationImage">
              CHOOSE IMAGE
            </label>
            <span
              id="uploadError"
              className="align-self-center"
              data-error={errors.location ? errors.location.message : ""}
            ></span>
          </div>
          <Map
            currentCoords={mapCurrentCoords}
            setCurrentCoords={setMapCurrentCoords}
            exposeCoords={mapExposeCoords}
            disabled={type === "edit" ? true : false}
          />
          <input
            id="locationImage"
            type="file"
            onInput={(e: any) => {
              if (e.target.files[0]) setLocationImagePreview(e.target.files[0]);
            }}
            {...register("location")}
          />
        </form>
        <DialogActions id="locationAddActions">
          <TextButton
            className="btn-text btn-fill-light"
            type="submit"
            form="locationAddForm"
            text={`${type === "edit" ? "EDIT" : "ADD"}`}
            clickAction={() => {}}
          />
          <span className="align-self-center" onClick={() => setOpen(false)}>
            Close
          </span>
        </DialogActions>
      </DialogContent>
      <Dialog id="locationAddResultDialog" open={resultDialogOpen}>
        <DialogContent>
          {operationResult && operationDetails ? (
            <>
              <p>{operationResult}</p>
              <p>{operationDetails}</p>
              <TextButton
                className="btn-text btn-fill-light"
                type="button"
                text="Close"
                clickAction={() => {
                  setOperationResult("");

                  setOperationDetails("");

                  setResultDialogOpen(false);
                }}
              />
            </>
          ) : (
            <div className="circular-progress">
              <CircularProgress color="success" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};
