export interface UserProfileModel {
    uid: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    dateOfBirth?: Date;
    location?: string;
    profilePicture?: string;
    phoneNumber?: string;
    bio?: string;
    documents?: object[];
    socialMedia?: object[];
}

