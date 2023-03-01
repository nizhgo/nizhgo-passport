export interface DocumentModel {
    uid: string;
    name: string;
    type: "passport" | "driversLicense" | "nationalID" | "birthCertificate" | "other";
    country?: string;
    info?: string;

}
