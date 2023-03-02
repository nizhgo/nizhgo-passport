import { Request, Response } from 'express';
import ProfileModel, {Profile} from '../models/profile.model';
class ProfileController {
   public static async profile_get(req: Request, res: Response) {
       const { uid } = req.body;
         try {
             const profile = await ProfileModel.findOne({ uid: uid });
                if (profile) {
                    res.status(200).json({ profile: profile });
                }
                else {
                    res.status(404).json({ message: 'Profile not found' });
                }
         }
            catch (err) {
                res.status(500).json({ error: err });
            }
   }

    public static async profile_create_post(req: Request, res: Response) {
    const { uid } = req.body;
    if (!uid) {
        //bad request
        res.status(400).json({ message: 'Bad request. UID is required' });
    }
    try {
                const profile = new ProfileModel({
                    uid: uid,
                });
                const r = await profile.save();
                res.status(200).json({ profile: r });
            }
            catch (err) {
                res.status(500).json({ error: err });
            }
    }

    public static async profile_update_post(req: Request, res: Response) {
        const asa: Profile = req.body;
        const uid = asa.uid;
        if (!uid) {
            //bad request
            res.status(400).json({ message: 'Bad request. UID is required' });
        }
        try {
            //TODO: Do profile update
        }
        catch (err) {
            res.status(500).json({ error: err });
        }
    }
}

export default ProfileController;
