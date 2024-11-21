// backend/profile/getProfiles.js
const profileInfo = require('../../../schemas/profileInfo');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const profileList = await profileInfo.find({}); // Fetch all profiles
        if (!profileList.length) {
            return res
                .status(400)
                .json({ error: 'No profiles have been created yet' });
        }
        return res.status(200).json(profileList); // Send the profiles as response
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
