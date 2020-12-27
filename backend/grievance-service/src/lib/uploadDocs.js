import { v4 as uuid } from "uuid";
import { uploadImageToS3 } from "./uploadImageToS3";

export async function uploadDocs({ supportingDocs, cgrcDocs, signature }) {
  const supportingDocsUrls = [];
  const cgrcDocsUrls = [];
  let signatureUrl = null;

  let supportingDocsPromises = null;
  let cgrcDocsPromises = null;

  if (Array.isArray(supportingDocs) && supportingDocs.length > 0) {
    supportingDocsPromises = supportingDocs.map(async ({ data, extension }) =>
      supportingDocsUrls.push(
        await uploadImageToS3({
          id: uuid(),
          extension,
          data,
        })
      )
    );
  }
  if (Array.isArray(cgrcDocs) && cgrcDocs.length > 0) {
    cgrcDocsPromises = cgrcDocs.map(async ({ data, extension }) =>
      cgrcDocsUrls.push(
        await uploadImageToS3({
          id: uuid(),
          extension,
          data,
        })
      )
    );
  }

  if (!!signature && Object.keys(signature).length > 0) {
    signatureUrl = await uploadImageToS3({
      id: uuid(),
      extension: signature.extension,
      data: signature.data,
    });
  }

  if (!!supportingDocsPromises) await Promise.all(supportingDocsPromises);
  if (!!cgrcDocsPromises) await Promise.all(cgrcDocsPromises);

  return {
    supportingDocsUrls,
    cgrcDocsUrls,
    signatureUrl,
  };
}
