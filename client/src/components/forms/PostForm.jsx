import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from 'react-toastify';
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import InputEmoji from 'react-input-emoji';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Button,
  Input,
  Textarea,
  Calendar,
} from "@/components/ui";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { PostValidation } from "@/lib/validation";
import { useAuthContext } from "../../context/AuthContext";
import Loader from "../../components/shared/Loader";
import { getRandomPrompt } from '../../utils';
import { useGenerateImage, useInterpretDream, useCreatePost, useUpdatePost } from "@/lib/react-query/queriesAndMutations";

const PostForm = ({ post, action }) => {
  const navigate = useNavigate();
  const { token } = useAuthContext();
  const form = useForm({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      dreamDescription: post ? post?.dreamDescription : "",
      imageUrl: post ? post?.imageUrl : "",
      interpretedDream: post ? post?.interpretedDream : "",
      dreamStory: post ? post?.dreamStory : "",
      dateTime: post ? new Date(post?.dateTime) : new Date(),
      location: post ? post?.location : "",
      tags: post ? JSON.stringify(post?.tags).slice(1, -1).replace(/"/g, '') : "",
      emotions: post ? post?.emotions : "",
    },
  });

  const [emotion, setEmotion] = useState(post ? post?.emotions : "")

  useEffect(() => {
    form.setValue('emotions', emotion);
  }, [emotion, form]);

  const { mutateAsync: generateImage, isPending: isGeneratingImg } = useGenerateImage(token);
  const { mutateAsync: interpretDream, isPending: isInterpretingDream } = useInterpretDream(token);
  const { mutateAsync: createPost, isPending: isLoadingCreate } = useCreatePost(token);
  const { mutateAsync: updatePost, isPending: isLoadingUpdate } = useUpdatePost(token);

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.getValues("dreamDescription"));
    form.setValue("dreamDescription", randomPrompt);
  };

  const handleGenerateImage = async () => {
    try {
      const generatedPhoto = await generateImage(form.getValues("dreamDescription"));

      if (generatedPhoto) {
        form.setValue("imageUrl", generatedPhoto);
      } else {
        toast.error("Generate image failed. Please try again.", {
          position: "top-center",
          hideProgressBar: true,
          theme: "dark",
        });

        return;
      }
    } catch (error) {
      toast.error(error.message, {
        position: "top-center",
        hideProgressBar: true,
        theme: "dark",
      });
      console.log(error);
    }
  }

  const handleInterpretDream = async () => {
    try {
      const interpretedDream = await interpretDream(form.getValues("dreamDescription"));

      if (interpretedDream) {
        form.setValue("interpretedDream", interpretedDream.bot);
      } else {
        toast.error("INterpret dream failed. Please try again.", {
          position: "top-center",
          hideProgressBar: true,
          theme: "dark",
        });

        return;
      }
    } catch (error) {
      toast.error(error.message, {
        position: "top-center",
        hideProgressBar: true,
        theme: "dark",
      });
      console.log(error);
    }
  }

  const handleSubmit = async (value) => {
    if (!form.getValues('dateTime')) {
      form.setValue("dateTime", new Date());
    }

    if (!form.getValues('imageUrl')) {
      toast.error("Please visualize your dream first✨", {
        position: "top-center",
        hideProgressBar: true,
        theme: "dark",
      });
      return;
    }

    try {
      //UPDATE
      if (post && action === "Update") {
        const updatedPost = await updatePost({
          ...value,
          postId: post._id,
        });

        if (updatedPost) {
          toast.success(`Dream udpated`, {
            position: "top-center",
            hideProgressBar: true,
            theme: "dark",
          });
          return navigate(`/posts/${post._id}`);
        } else {
          toast.error(`${action} failed. Please try again.`, {
            position: "top-center",
            hideProgressBar: true,
            theme: "dark",
          });
        }
      }

      //CREATE(Share)
      const newPost = await createPost({
        ...value,
      });

      if (newPost) {
        toast.success(`Dream shared`, {
          position: "top-center",
          hideProgressBar: true,
          theme: "dark",
        });
      } else {
        toast.error(`${action} failed. Please try again.`, {
          position: "top-center",
          hideProgressBar: true,
          theme: "dark",
        });
      }
      navigate("/");
    } catch (error) {
      toast.error(error.message, {
        position: "top-center",
        hideProgressBar: true,
        theme: "dark",
      });
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-9 w-full  max-w-5xl"
      >

        <FormField
          control={form.control}
          name="dreamDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label text-base sm:text-lg">Describe to visualize your Dream</FormLabel>
              {action === "Update" ? "" :
                <Button
                  type="button"
                  className="bg-primary-500 hover:bg-primary-700 rounded-full ml-4 h-6"
                  onClick={() => handleSurpriseMe()}>
                  Surprise Me 💭
                </Button>
              }
              <FormControl>
                <Textarea
                  className="shad-textarea_secondary custom-scrollbar shad-input"
                  placeholder="Instructions: Include vivid details to create an interesting dream story"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <Button
          type="button"
          className="shad-button_primary"
          onClick={() => handleGenerateImage()}
          disabled={isGeneratingImg}>
          {isGeneratingImg ? (
            <div className="flex-center gap-2">
              <Loader /> Visualizing...
            </div>
          ) :
            action === "Update" ? 'Re-Visualize Your Dream 💫' :
              'Visualize Your Dream 💫'
          }
        </Button>

        <div className='relative bg-dark-3 border border-dark-3 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3 flex justify-center items-center'>
          {form.getValues("imageUrl") ? (
            <img
              src={form.getValues("imageUrl")}
              alt={form.getValues("dreamDescription")}
              className='w-full h-full object-contain'
            />
          ) : (
            <img
              src="/assets/images/preview.png"
              alt="preview"
              className='w-9/12 h-9/12 object-contain opacity-40 invert'
            />
          )}

          {isGeneratingImg && (
            <div className='absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg'>
              <Loader />
            </div>
          )}
        </div>

        <Button
          type="button"
          className="shad-button_primary"
          onClick={() => handleInterpretDream()}
          disabled={isInterpretingDream}>
          {isInterpretingDream ? (
            <div className="flex-center gap-2">
              <Loader /> Interpreting...
            </div>
          ) :
            form.getValues("interpretedDream") ? 'Re-Interpret Your Dream 💫' :
              'Interpret Your Dream 💫'
          }
        </Button>

        <FormField
          control={form.control}
          name="interpretedDream"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  disabled
                  placeholder="Your interpreted dream will show here..."
                  className="shad-textarea custom-scrollbar shad-input"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dreamStory"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label text-base sm:text-lg">Additional Details</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share the details of your dream..."
                  className="shad-textarea custom-scrollbar shad-input"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dateTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label text-base sm:text-lg">When Did You Dream?</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal w-full shad-input",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    // styles={{
                    //   caption: { color: '#887cfc'},
                    // }}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label text-base sm:text-lg">Where Were You At? </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., sky"
                  type="text"
                  className="shad-input"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label text-base sm:text-lg">
                Tags <span className="text-base">(separated by comma " , ")</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., adventure, fantasy, flying"
                  type="text"
                  className="shad-input"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="emotions"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label text-base sm:text-lg">
                What's Your Mood?
              </FormLabel>
              <FormControl>
                <InputEmoji
                  value={emotion}
                  onChange={setEmotion}
                  placeholder="e.g., 🤩😇🦋"
                  borderRadius={6}
                  theme="dark"
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <div className="flex gap-4 items-center justify-end">
          {/* //debug
          <Button
            type="button"
            className="shad-button_dark_4"
            onClick={() => console.log(form.getValues())}>
            test
          </Button> */}
          <Button
            type="button"
            className="shad-button_dark_4"
            onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
            disabled={isLoadingCreate || isLoadingUpdate}>
            {(isLoadingCreate || isLoadingUpdate) && <Loader />}
            {action} Dream
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
