'use client';
import { useState } from 'react';
import { Button } from '@layowt/components/src/ui/button';
import { Dialog, DialogContent } from '@layowt/components/src/ui/dialog';
import SiteOnboardingTitle from './modal-title';
import { toast } from 'sonner';
import ModalColorPicker, { ModalColorPickerTrigger } from './modal-color-picker';
import { InputWithLabel } from '@layowt/components/src/ui/input-label';
import {
  Form,
  FormControl,
  FormField,
  FormMessage
} from '@layowt/components/src/ui/form'
import { useAppSelector, useAppDispatch } from '@/utils/index';
import { setWebsite, website } from '@/store/slices/website-store';
import { updateWebsite } from '@/actions/websites/update';
import { ReloadIcon } from '@radix-ui/react-icons';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { websiteDataSchema } from '@/lib/zod/schemas/website-data';
import { useMutation } from '@tanstack/react-query';

type SchemaProps = z.infer<typeof websiteDataSchema>;

export default function UserSiteData() {
  const dispatch = useAppDispatch();
  const currentSite = useAppSelector(website);

  const [openModal, setOpenModal] = useState<boolean>(true);

  const form = useForm<SchemaProps>({
    resolver: zodResolver(websiteDataSchema),
    defaultValues: {
      websiteLogo: currentSite?.websiteLogo || '',
      websiteName: currentSite?.websiteName || '',
      websitePrimaryColor: currentSite?.websitePrimaryColor || '#ffffff',
      websiteSecondaryColor: currentSite?.websiteSecondaryColor || '#6725f2'
    }
  });

  const {
    mutateAsync: server_updateWebsite,
    isPending,
    isError
  } = useMutation({
    mutationFn: (data: SchemaProps) => updateWebsite(currentSite.websiteId, data),
    onSuccess: (data) => {
      dispatch(
        setWebsite({
          ...currentSite,
          ...data,
          lastUpdated: new Date()
        })
      );
      setOpenModal(false);
      toast.success('Website data saved successfully! 🎉');
    },
    onError: (e) => {
      console.error('Error in user-site-data.tsx', e);
      toast.error('There was an error saving your website data');
    }
  });

  const onSubmit = async (values: SchemaProps) => {
    if (!values.websiteName) 
      return;    
    await server_updateWebsite(values);
  };

  return (
    <Dialog
      modal={true}
      open={openModal}
      onOpenChange={setOpenModal}
    >
      <DialogContent
        className="bg-black-75 border border-black-50 focus:outline-none rounded-lg shadow-lg sm:rounded-lg p-6 w-full max-w-lg"
        showCloseButton={true}
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <Form {...form}>
          <form
            className="flex flex-col gap-y-2"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <SiteOnboardingTitle
              userId={currentSite?.userId}
              website={currentSite}
              onLogoChange={(logo) => form.setValue('websiteLogo', logo)}
            />
            <div className="flex flex-col gap-4 mt-6">
              <FormField
                control={form.control}
                name="websiteName"
                render={({ field }) => (
                  <FormControl>
                    <div className="col-span-6">
                      <InputWithLabel
                        label="Site Name"
                        type="text"
                        placeholder="My website"
                        {...field}
                      />
                      <FormMessage>{form.formState.errors.websiteName?.message}</FormMessage>
                    </div>
                  </FormControl>
                )}
              />
              <div className="flex gap-4 mt-2 text-white">
                <ModalColorPicker 
                  color={form.watch('websitePrimaryColor')}
                  onColorChange={(color) => form.setValue('websitePrimaryColor', color)}
                  trigger={<ModalColorPickerTrigger color={form.watch('websitePrimaryColor')} />}
                />
                <ModalColorPicker
                  color={form.watch('websiteSecondaryColor')}
                  onColorChange={(color) => form.setValue('websiteSecondaryColor', color)}
                  trigger={<ModalColorPickerTrigger color={form.watch('websiteSecondaryColor')} />}
                />
              </div>
              <div className="w-full flex justify-between items-center mt-2 text-white">
                <Button variant="none" onClick={() => form.reset()}>Clear</Button>
                <div className="flex gap-x-4">
                  <Button
                    type="submit"
                    variant="default"
                    padding="md"
                    disabled={!form.watch('websiteName') || isPending || isError}
                  >
                    {isPending ? (
                      <div className="w-6 flex items-center">
                        <ReloadIcon className="animate-spin" />
                      </div>
                    ) : (
                      'Save'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}