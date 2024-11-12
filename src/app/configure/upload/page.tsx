'use client'

import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import { useUploadThing } from '@/lib/uploadthing'
import { cn } from '@/lib/utils'
import { Image, Loader2 } from 'lucide-react'
import { MousePointerSquareDashed } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import Dropzone, { FileRejection } from 'react-dropzone'

export default function Page() {
	const router = useRouter()
	const { toast } = useToast()
	//--
	const [isPending, startTransition] = useTransition()
	const [isDragOver, setIsDragOver] = useState<boolean>(false)
	const [uploadProgress, setUploadProgress] = useState<number>(0)
	//--
	const { startUpload, isUploading } = useUploadThing('imageUploader', {
		onClientUploadComplete: ([data]) => {
			const configId = data.serverData.configId
			console.log('data', data)
			startTransition(() => {
				router.push(`/configure/design?id=${configId}`)
			})
		},
		onUploadProgress: (progress) => {
			setUploadProgress(progress)
		},
	})
	const onDropRejected = (rejectedFiles: FileRejection[]) => {
		console.log('rejectedFiles', rejectedFiles)
		const [file] = rejectedFiles
		setIsDragOver(false)

		toast({
			title: `${file.file.type} type is not supported.`,
			description: 'Please choose a PNG, JPG, or JPEG image instead.',
			variant: 'destructive',
		})
	}
	const onDropAccepted = (acceptedFiles: File[]) => {
		console.log('acceptedFiles', acceptedFiles)
		startUpload(acceptedFiles, { configId: undefined })
		setIsDragOver(false)
	}
	//--
	return (
		<div
			className={cn(
				'relative h-full flex-1 my-16 w-full rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl flex justify-center flex-col items-center',
				{
					'ring-blue-900/25 bg-blue-900/10': isDragOver,
				}
			)}
		>
			<div className='relative flex flex-1 flex-col items-center justify-center w-full'>
				<Dropzone
					onDropAccepted={onDropAccepted}
					onDropRejected={onDropRejected}
					onDragEnter={() => setIsDragOver(true)}
					onDragLeave={() => setIsDragOver(false)}
					accept={{
						'image/png': ['.png'],
						'image/jpeg': ['.jpeg'],
						'image/jpg': ['.jpg'],
					}}
				>
					{({ getRootProps, getInputProps }) => (
						<div
							{...getRootProps()}
							className='h-full w-full flex-1 flex flex-col items-center justify-center'
						>
							<input {...getInputProps()} />
							{isDragOver ? (
								<MousePointerSquareDashed className='h-6 w-6 text-zinc-500 mb-2' />
							) : isUploading || isPending ? (
								<Loader2 className='animate-spin h-6 w-6 text-zinc-500 mb-2' />
							) : (
								<Image className='h-6 w-6 text-zinc-500 mb-2' />
							)}
							<div className='flex flex-col justify-center mb-2 text-sm text-zinc-700'>
								{isUploading ? (
									<div className='flex flex-col items-center'>
										<p>Uploading...</p>
										<Progress
											value={uploadProgress}
											className='mt-2 w-40 h-2 bg-gray-300'
										/>
									</div>
								) : isPending ? (
									<div className='flex flex-col items-center'>
										<p>Redirecting, please wait...</p>
									</div>
								) : isDragOver ? (
									<p>
										<span className='font-semibold'>Drop file</span> to upload
									</p>
								) : (
									<p>
										<span className='font-semibold'>Click to upload</span> or
										drag and drop
									</p>
								)}
							</div>
							{isPending ? null : (
								<p className='text-xs text-zinc-500'>PNG, JPG, JPEG</p>
							)}
						</div>
					)}
				</Dropzone>
			</div>
		</div>
	)
}
