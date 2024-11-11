'use client'

import { cn } from '@/lib/utils'
import { useState, useTransition } from 'react'
import Dropzone, { FileRejection } from 'react-dropzone'

export default function Page() {
	const [isDragOver, setIsDragOver] = useState<boolean>(false)

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
					onDrop={(acceptedFiles) => {
						console.log(acceptedFiles)
					}}
					onDragEnter={() => setIsDragOver(true)}
					onDragLeave={() => setIsDragOver(false)}
					accept={{
						'image/png': ['.png'],
						'image/jpeg': ['.jpeg'],
						'image/jpg': ['.jpg'],
					}}
				>
					{({ getRootProps, getInputProps }) => (
						<div {...getRootProps()}>
							<input {...getInputProps()} />
							Upload
						</div>
					)}
				</Dropzone>
			</div>
		</div>
	)
}