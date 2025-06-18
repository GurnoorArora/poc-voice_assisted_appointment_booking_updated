const express = require('express');
const axios = require('axios');
const router = express.Router();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';



const bearer_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkNOdjBPSTNSd3FsSEZFVm5hb01Bc2hDSDJYRSIsImtpZCI6IkNOdjBPSTNSd3FsSEZFVm5hb01Bc2hDSDJYRSJ9.eyJhdWQiOiJodHRwczovL21hbmFnZW1lbnQuYXp1cmUuY29tIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvM2VjNGVkYTEtYTVkMS00MzNkLTkwZGEtOGRjNzkxMjgzZDk1LyIsImlhdCI6MTc1MDEzOTU3NywibmJmIjoxNzUwMTM5NTc3LCJleHAiOjE3NTAxNDM0NzcsImFpbyI6ImsyUmdZTmd6YTRKbDk0NldDMzkxM3dqVXFTOHZBZ0E9IiwiYXBwaWQiOiI1ZGZjMDgyNS04Y2JlLTQ1NWQtOTM0Yy0wZGUyNTM5NWQ2YjYiLCJhcHBpZGFjciI6IjEiLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8zZWM0ZWRhMS1hNWQxLTQzM2QtOTBkYS04ZGM3OTEyODNkOTUvIiwiaWR0eXAiOiJhcHAiLCJvaWQiOiIwODg5YTQ5ZS1hM2Y2LTRmYWUtODE5MC1iNmFkY2M5ZjdlMzUiLCJyaCI6IjEuQVJJQW9lM0VQdEdsUFVPUTJvM0hrU2c5bFVaSWYza0F1dGRQdWtQYXdmajJNQk1TQUFBU0FBLiIsInN1YiI6IjA4ODlhNDllLWEzZjYtNGZhZS04MTkwLWI2YWRjYzlmN2UzNSIsInRpZCI6IjNlYzRlZGExLWE1ZDEtNDMzZC05MGRhLThkYzc5MTI4M2Q5NSIsInV0aSI6IjlNeWRkb0tuMms2aTJkZTVFNzRaQUEiLCJ2ZXIiOiIxLjAiLCJ4bXNfZnRkIjoia1o2WEZTSENwRElUdmozOVNXSm5YOURuc2dySkRGS2FTRTBvWFg1cUlsa0JkWE51YjNKMGFDMWtjMjF6IiwieG1zX2lkcmVsIjoiNyAyOCIsInhtc19yZCI6IjAuNDJMbFlCSmlGQklTNFdBWEVsaXViYlIzVHVnYWwzME5QanpkZGFxWGdhS2NRZ0lWN0h2UEZMZzctblpHWjZuV2QtcUZBRVU1aEFUY1BPb3JHWFpkOTlfbGZPdmdqMjhHd2dBIiwieG1zX3RjZHQiOjE0MjYwMjMyMzN9.B0U9jNBuvrxNY6HgTRyh5T5VVVcdfeXoh8BdlOStp0hzmbQPFs0p-6xwZGGF9b9QKfT5e5j4ANkvkL_1bjEqNV0txzDAMIU3M3yzCi0lRMrouCYuDPQ5jH4Y9VwH6902pO4z2JFZPDCluFn9owCidszw9XExH8Tt1_S9As53aHOuaG7ozAWxqpeUYbml7Rv_9Z6IK2DKIWy6sWPEjY9E7o73En4r-pKBLIR1IDRqUUCMArEtzMXER7aOPbv0aRlXXqdZlmplm6z5t4Xf2PZ06wyT64rcYrxnAUVwP9XBvoHqMkD5FAK-8nsb2sMvpyyE3xC6FnD5Jmnd9oF5-iLkKQ"

router.post('/', async (req, res) => {
    const intent = req.body.intent;

    if (intent === 'insertAppointment') {
        console.log('request body:', req.body);
        const payload = req.body.booking_payload;
        console.log('Received booking payload:', payload);

        if (!payload) {
            return res.status(400).json({ message: 'Invalid booking payload.' });
        }

        try {
            const response = await axios.post(
                "https://am-svc-api-qa.hrblock.net/api/Appointment",
                payload,
                {
                    headers: {
                        'Authorization': `Bearer ${bearer_token}`,
                        'Content-Type': 'application/json',
                        'app_id': '550'
                    }
                }
            );

            if (response.status === 200) {
                return res.status(200).json({ message: ' Appointment booked successfully.' });
            } else {
                return res.status(response.status).json({ message: ' Failed to book appointment.' });
            }

        } catch (error) {
            console.error('Error booking appointment:', error.message);
            return res.status(500).json({ message: ' Booking failed. Please try again later.' });
        }

    } else {
        return res.status(400).json({ message: 'Unsupported intent.' });
    }
});

module.exports = router;
