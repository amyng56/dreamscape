import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SigninValidation } from "../../lib/validation";
import { Loader } from "../../components/shared";
import { useSignInUser } from "@/lib/react-query/queriesAndMutations";
import { useAuthContext } from "../../context/AuthContext";
import { createOrGetUser } from "../../lib/apis/user";

const SigninForm = () => {
  const { dispatch } = useAuthContext();

  const { mutateAsync: signInUser, isPending: isSigningInUser } = useSignInUser();

  const form = useForm({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const handleSignIn = async (user) => {
    try {
      const session = await signInUser(user);

      if (session) {
        dispatch({ type: 'LOGIN', payload: session });

      } else {
        toast.error("Login failed. Please try again.", {
          position: "top-left",
          hideProgressBar: true,
          theme: "dark",
        });

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
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.png" alt="logo" className="h-1/3"/>

        <h2 className="h3-bold md:h2-bold pt-2 sm:pt-4">
          Log in to your account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          Welcome back! Please enter your details.
        </p>
        <form
          onSubmit={form.handleSubmit(handleSignIn)}
          className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Email</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
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
                <FormLabel className="shad-form_label">Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="shad-button_primary">
            {isSigningInUser ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Log in"
            )}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Don&apos;t have an account?
            <Link
              to="/sign-up"
              className="text-primary-500 text-small-semibold ml-1">
              Sign up
            </Link>
          </p>

          {/* <div className="items-center w-full">
            <p className="text-center mt-2 mb-8">
              or
            </p>

            <GoogleLogin
              onSuccess={credentialResponse => {
                createOrGetUser(credentialResponse);
              }}
              onError={() => {
                console.log('Login failed. Please try again.');
              }}
              text="continue_with"
            />
          </div> */}

        </form>
      </div>
    </Form>
  )
}

export default SigninForm;