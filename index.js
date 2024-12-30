import {getWeather} from "./weatherAPI.js";
import {
    dataWeatherDisplay,
    describeCurrentWeather,
    describeWholeDayWeather,
    findRainyPeriods
} from "./weatherDescribe.js";
import AWS from "aws-sdk";
import {suggestClothes} from "./clothingSuggestion.js";
import {getAllUser} from "./userController.js";
import moment from "moment-timezone";
import * as geoTz from "geo-tz";
//
const ses = new AWS.SES({apiVersion: '2010-12-01'});

export async function main() {
    let users = await getAllUser();
    if (!users || users.length === 0) {
        console.log("No users found.");
        return;  // Exit if no users or undefined
    }
    for(let i = 0; i < users.length; i++){
        if(await checkEmailVerification(users[i].email)){

            const weatherData = await getWeather(users[i]);
            // console.log(weatherData.hourly.length);
            // for(let i = 0 ; i < weatherData.hourly.length;i++){
            //     console.log(convertToLocalTime(weatherData.hourly[i].dt,-4));
            // }
            let outputMessage = '';
            const timezone = geoTz.find(users[i].latitude, users[i].longitude)[0]; // geo-tz returns an array of possible timezones

            console.log(`test ${users[i].email}  `);
            outputMessage+=   describeWholeDayWeather(weatherData,timezone);
            outputMessage += findRainyPeriods(weatherData,timezone);
            outputMessage += describeCurrentWeather(weatherData);
            outputMessage += suggestClothes(weatherData);
            outputMessage += dataWeatherDisplay(weatherData,timezone);
            console.log(outputMessage);
            // await emailTemplate(outputMessage,users[i]);
        } else{
            console.log(`\n${users[i].email}  not verify yet`);
        }


    }


}
main()
async function checkEmailVerification(email) {
    const params = {
        Identities: [email]
    };

    try {
        const response = await ses.getIdentityVerificationAttributes(params).promise();
        const attributes = response.VerificationAttributes[email];
        // console.log(attributes.VerificationStatus);
        return attributes && attributes.VerificationStatus === 'Success';
    } catch (error) {
        console.error('Error checking email verification:', error);
        return false;
    }
}

async function emailTemplate(message,user) {
    const params = {
        Destination: { /* required */
            ToAddresses: [
                user.email,
            ]
        },
        Message: { /* required */
            Body: { /* required */
                // Html: {
                //     Charset: "UTF-8",
                //     Data: "HTML_FORMAT_BODY"
                // },
                Text: {
                    Charset: "UTF-8",
                    Data: message
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'Weather Forecast AI'
            }
        },
        Source: 'minhbac333@gmail.com', /* required */
    };
    await ses.sendEmail(params).promise();

    console.log('SMS sent to :', user.email);
}
