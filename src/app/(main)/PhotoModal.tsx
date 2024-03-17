import { useState } from 'react';
import Image from 'next/image';
import { createPhoto } from '@/api/photoApi';
import { uploadImgur } from '@/api/upload';
import portraitImage from '@/assets/Portrait.png';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import SubmitButton from '@/components/ui/SubmitButton';

export default function PhotoModal() {
  const PhotoFormSchema = z.object({
    id: z.number().optional(),
    title: z.string(),
    image: z.string(),
    slug: z.coerce.string({ required_error: 'Slug is required' }).min(1).trim(),
    mainImage: z.any({ required_error: 'Main image is required' }),
    mainImageUrl: z.string().optional(),
    width: z.string(),
    height: z.string(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  });

  const defaultValues = {
    title: '',
    slug: '',
    mainImage: undefined,
    mainImageUrl: '',
    image: undefined,
    width: '',
    height: '',
  };
  const [createButon, setCreateButon] = useState<
    'Normal' | 'Loading' | 'Error' | 'Success'
  >('Normal');
  const [changeImage, setChangeImage] = useState(false);
  const form = useForm<z.infer<typeof PhotoFormSchema>>({
    resolver: zodResolver(PhotoFormSchema),
    defaultValues: defaultValues,
  });
  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file === null) return;
    if (file && file.type.startsWith('image/')) {
      setChangeImage(true);
      const reader = new FileReader();
      setValue('image', '');
      reader.onloadend = () => {
        setValue('mainImage', reader.result);
        const img = document.createElement('img');
        img.onload = () => {
          setValue('width', img.width.toString());
          setValue('height', img.height.toString());
        };
        img.src = reader.result?.toString() ?? '';
      };
      reader.readAsDataURL(file);
    }
  };

  const { setValue, watch } = form;
  const mainImage = watch('mainImage');
  const mainImageUrl = watch('mainImageUrl');
  const queryClient = useQueryClient();
  async function onSubmit(values: z.infer<typeof PhotoFormSchema>) {
    console.log(values);
    setCreateButon('Loading');
    const { image, ...rest } = values;
    // upload imgur, if there is change
    if (changeImage) {
      try {
        const imgur = await uploadImgur(rest.mainImage);
        console.log(imgur);
        if (imgur.status === 200) {
          rest.mainImageUrl = imgur.data.link;
        } else {
          setCreateButon('Error');
          return;
        }
      } catch (error) {
        setCreateButon('Error');
        return;
      }
    }

    submitData(rest);
    return;
  }

  type PostCreateState = 'error' | 'sucess' | 'database error';
  const { mutate: submitData } = useMutation({
    mutationFn: (data: any) => createPhoto(data, changeImage),
    onSuccess(data: PostCreateState) {
      if (data === 'sucess') {
        setCreateButon('Success');
        return;
      }
      setCreateButon('Error');
    },
    onError(error) {
      setCreateButon('Error');
    },
  });
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>添加图片</Button>
      </DialogTrigger>

      <DialogContent className="bg-slate-50	 dark:bg-black	 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>添加图片</DialogTitle>
          <DialogDescription>记录你的视觉生活</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
            <div className="grid gap-4 py-4">
              {/** submit */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>标题</FormLabel>
                    <FormControl>
                      <Input
                        className="peer block w-full rounded-md border border-gray-200 py-2 pl-5 text-sm outline-2 placeholder:text-gray-500"
                        placeholder="Enter title name"
                        {...field}
                      ></Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>标签</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter slug"
                        className="peer block w-full rounded-md border border-gray-200 py-2 pl-5 text-sm outline-2 placeholder:text-gray-500"
                        {...field}
                        value={field.value}
                        onChange={(e) => {
                          const slugData = e.target.value;
                          setValue('slug', slugData);
                          //  check slug is exist for database
                          queryClient.invalidateQueries({
                            queryKey: ['slugQuery', slugData],
                          });
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>图片</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="peer block w-full rounded-md border border-gray-200 py-2 pl-5 text-sm outline-2 placeholder:text-gray-500"
                        type="file"
                        value={field.value}
                        ref={field.ref}
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                    </FormControl>
                    <FormDescription>
                      {mainImageUrl && mainImageUrl != '' && !changeImage ? (
                        <Image
                          width={200}
                          height={200}
                          className="rounded-lg"
                          src={mainImageUrl}
                          blurDataURL={mainImage}
                          alt="preview"
                          sizes="(max-width: 100px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <Image
                          width={200}
                          height={200}
                          className="rounded-lg"
                          src={
                            mainImage && mainImage != ''
                              ? mainImage
                              : portraitImage
                          }
                          alt="preview"
                          sizes="(max-width: 100px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <SubmitButton buttonState={createButon} type="submit">
                Submit
              </SubmitButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
