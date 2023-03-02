import mongoose from 'mongoose';

export interface Profile extends mongoose.Document {
    uid: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    gender?: string;
    birthDate?: Date;
    location?: {
        country?: string;
        city?: string;
    };
    socialMedia?: {
        telegram?: string;
        facebook?: string;
        instagram?: string;
        twitter?: string;
        another?: string[];
    };
    avatar?: string;
}

const ProfileSchema = new mongoose.Schema<Profile>({
    uid: { type: String, required: true, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    phoneNumber: { type: String },
    gender: { type: String },
    birthDate: { type: Date },
    location: {
        country: { type: String },
        city: { type: String },
    },
    socialMedia: {
        telegram: { type: String },
        facebook: { type: String },
        instagram: { type: String },
        twitter: { type: String },
        another: [{ type: String }],
    },
    avatar: { type: String },
});


    const ProfileModel = mongoose.model<Profile>('profiles', ProfileSchema);

export default ProfileModel;
