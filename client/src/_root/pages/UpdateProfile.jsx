import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { toast } from 'react-toastify';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea, Input, Button } from "@/components/ui";
import { ProfileUploader, Loader } from "@/components/shared";

import { ProfileValidation } from "@/lib/validation";
import { useAuthContext } from "@/context/AuthContext";
import { useGetUserById, useUpdateUser } from "@/lib/react-query/queriesAndMutations";

const serverMediaUrl = `${process.env.SERVER_URL}/uploads/`;

const UpdateProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, dispatch, token } = useAuthContext();

  const form = useForm({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      file: [],
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio || "",
    },
  });

  useEffect(() => {
    form.reset({
      file: [],
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio || "",
    });
  }, [user]);

  //Queries
  const { data: currentUser } = useGetUserById(id || "", token);
  const { mutateAsync: updateUser, isLoading: isLoadingUpdate } = useUpdateUser(token);

  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  //Handler
  const handleUpdate = async (value) => {
    console.log(value.file);
    console.log("form: ", form.getValues());
    const updatedUser = await updateUser(
      {
        userId: currentUser._id,
        name: value.name,
        bio: value.bio,
        file: value.file,
        profilePicture: currentUser.profilePicture,
      }
    );

    if (!updatedUser) {
      toast.error("Update user failed. Please try again.", {
        position: "top-left",
        hideProgressBar: true,
        theme: "dark",
      });
    }

    dispatch({
      type: 'UPDATE USER', payload: {
        // ...user,
        name: updatedUser?.name,
        bio: updatedUser?.bio,
        profilePicture: updatedUser?.profilePicture,
      }
    });
    return navigate(`/profile/${id}`);
  };

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex-start gap-3 justify-start w-full max-w-5xl">
          <img
            src="/assets/icons/edit.svg"
            width={36}
            height={36}
            alt="edit"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Profile</h2>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdate)}
            className="flex flex-col gap-7 w-full mt-4 max-w-5xl"
          >
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem className="flex">
                  <FormControl>
                    <ProfileUploader
                      fieldChange={field.onChange}
                      mediaUrl={currentUser.profilePicture ? serverMediaUrl + currentUser.profilePicture : ""}
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Name</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Username</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="shad-input"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="shad-input"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      className="shad-textarea custom-scrollbar"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />

            <div className="flex gap-4 items-center justify-end">
              <Button
                type="button"
                className="shad-button_dark_4"
                onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="shad-button_primary whitespace-nowrap"
                disabled={isLoadingUpdate}>
                {isLoadingUpdate && <Loader />}
                Update Profile
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UpdateProfile;