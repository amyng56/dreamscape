import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SignupValidation } from "@/lib/validation";
import { Loader } from "@/components/shared";
import { useCreateUser, useSignInUser } from "@/lib/react-query/queriesAndMutations";
import { useAuthContext } from "../../context/AuthContext";

const SignupForm = () => {
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();

  const { mutateAsync: createUser, isPending: isCreatingUser } = useCreateUser();
  const { mutateAsync: signInUser, isPending: isSigningInUser } = useSignInUser();

  const form = useForm({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  })

  const handleSignUp = async (user) => {
    try {
      const newUser = await createUser(user);

      if (!newUser) {
        toast.error("Sign up failed. Please try again.", {
          position: "top-left",
          hideProgressBar: true,
          theme: "dark",
        });

        return;
      }

      const session = await signInUser({
        email: user.email,
        password: user.password,
      });

      if (session) {
        dispatch({ type: 'LOGIN', payload: session });

      } else {
        toast.error("Something went wrong. Please login your new account.", {
          position: "top-left",
          hideProgressBar: true,
          theme: "dark",
        });

        navigate("/sign-in");

        return;
      }
    } catch (error) {
      toast.error(error.message, {
        position: "top-left",
        hideProgressBar: true,
        theme: "dark",
      });
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        {/* <div className="flex items-center"> */}
        <img src="/assets/images/logo.png" alt="logo" className="h-1/4 pt-1" />
        {/* <p className="ml-2 text-lg text-white font-semibold">Dreamscape</p> */}
        {/* </div> */}
        <h2 className="h3-bold md:h2-bold pt-1">
          Create a new account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          To use Dreamscape, please enter your details
        </p>
        <form onSubmit={form.handleSubmit(handleSignUp)} className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
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
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary">
            {isCreatingUser || isSigningInUser ? (
              <div className="flex-center gap-2">
                <Loader />Loading...
              </div>
            ) : "Sign Up"}
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account?
            <Link
              to="/sign-in"
              className="text-primary-500 text-small-semibold ml-1">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SignupForm;