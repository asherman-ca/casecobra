import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { UploadThingError } from 'uploadthing/server'
import { z } from 'zod'

const f = createUploadthing()

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
	// Define as many FileRoutes as you like, each with a unique routeSlug
	imageUploader: f({ image: { maxFileSize: '4MB' } })
		.input(z.object({ configId: z.string().optional() }))
		// Set permissions and file types for this FileRoute
		.middleware(async ({ input }) => {
			// This code runs on your server before upload
			// input with metadata passes through the middleware
			return { input }
		})
		.onUploadComplete(async ({ metadata, file }) => {
			// This code RUNS ON YOUR SERVER after upload
			// console.log('Upload complete for userId:', metadata.userId)

			const { configId } = metadata.input

			return { configId }
		}),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
