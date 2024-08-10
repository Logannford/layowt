import type { ErrorCodes } from "@layowt/types/src/Constants"

export const ERROR_CODES: ErrorCodes = {
  "not-authenticated": {
    title: "You need to sign in to access this page.",
    description: "To access this page, you need to sign in. Please sign in to continue."
  },
  "unauthorized-site-access": "You are not authorized to access this site. Please login to access this site.",
  "website-not-found": {
    title: "Website not found",
    description: "The website you are looking for does not exist. Please check the URL and try again."
  }
}