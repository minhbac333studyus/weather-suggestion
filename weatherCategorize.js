

// Temperature ranges in Fahrenheit
const feelLikeRanges = {
    freezing: {
        min: -60, max: 30,
        description: 'dangerously cold, almost like being inside a freezer. Frostbite possible '
    },
    cold: {
        min: 30, max: 50,
        description: 'cold, noticeably chilly '
    },
    cool: {
        min: 50, max: 68,
        description: 'cool, a bit brisk especially in the shade or when the wind blows '
    },
    comfortable: {
        min: 68, max: 78,
        description: 'comfortable, and ideal for most outdoor activities '
    },
    warm: {
        min: 78, max: 85,
        description: 'warm, feels heat especially under the sun '
    },
    hot: {
        min: 85, max: 95,
        description: 'hot, the heat can be intense and sometimes overwhelming '
    },
    extreme: {
        min: 95, max: 120,
        description: 'extremely hot, often unbearably so, like standing near a furnace '
    }
};

const windRanges = {
    calm: {
        min: 0, max: 5,
        description: 'very light winds, almost still. Perfect for a quiet, peaceful day.'
    },
    breezy: {
        min: 5, max: 12,
        description: 'noticeable but gentle wind, pleasant for outdoor activities like walking.'
    },
    windy: {
        min: 12, max: 20,
        description: 'stronger wind, can be felt pushing against you, may sway smaller tree branches.'
    },
    veryWindy: {
        min: 20, max: 30,
        description: 'forceful wind, difficult for walking and capable of moving unsecured objects.'
    },
    extreme: {
        min: 30, max: 100,
        description: 'dangerously powerful winds, can cause damage to buildings and trees, and make it unsafe to be outside.'
    }
};

const humidityRanges = {
    dry: {
        min: 0, max: 30,
        description: 'the air is very dry, which can enhance sensations of dry skin and respiratory discomfort.'
    },
    comfortable: {
        min: 30, max: 50,
        description: 'dew point is comfortable, making it ideal for outdoor activities without feeling too dry or too humid.'
    },
    moderate: {
        min: 50, max: 70,
        description: 'it\'s slightly humid. You might notice a bit more moisture in the air, but it remains comfortable for most activities.'
    },
    humid: {
        min: 70, max: 85,
        description: 'the air is getting humid. Activities might feel more strenuous as the air feels heavier and slightly oppressive.'
    },
    veryHumid: {
        min: 85, max: 100,
        description: 'it is very humid. The moisture level in the air is high, making the environment feel sticky and uncomfortable.'
    }
};

const rainRanges = {
    noRain: {
        min: 0, max: 2.54,
        description: 'no rain is expected. It’s a great day to be outside without an umbrella!'
    },
    lightRain: {
        min: 2.54, max: 7.62,
        description: 'there is light rain. You’ll see a gentle drizzle that might not even require an umbrella, but a light jacket could be handy.'
    },
    moderateRain: {
        min: 7.62, max: 12.7,
        description: 'there is moderate rain. Expect steady rainfall that will make puddles and likely require a good raincoat and waterproof shoes.'
    },
    heavyRain: {
        min: 12.7, max: 50.8,
        description: 'there is heavy rain. It’s pouring hard, forming large puddles and making it difficult to stay dry even with an umbrella!'
    },
    extremeRain: {
        min: 50.8, max: 2000,
        description: 'extreme rainfall is expected. The rain will be torrential, potentially leading to flooding. It’s best to stay indoors if possible.'
    }
};
const dewPointRanges = {
    veryDry: {
        min: -60, max: 32,
        description: ' very dry, which can enhance sensations of dry skin and respiratory discomfort, typical in very cold climates.'
    },
    comfortable: {
        min: 32, max: 55,
        description: ' comfortable, making it ideal for most people for outdoor activities without feeling too dry or too humid.'
    },
    slightlyHumid: {
        min: 55, max: 60,
        description: ' slightly humid. You might notice a bit more moisture in the air, but it remains comfortable for most activities.'
    },
    humid: {
        min: 60, max: 65,
        description: ' humid. Activities might feel more strenuous as the air feels heavier and slightly oppressive.'
    },
    veryHumid: {
        min: 65, max: 70,
        description: ' very humid. The moisture level in the air is high, making the environment feel sticky and uncomfortable.'
    },
    oppressive: {
        min: 70, max: 80,
        description: ' oppressive. It\'s extremely uncomfortable, and staying cool is a challenge, often causing significant discomfort.'
    }
};

export function findCategory(value, ranges) {
    for (const [key, {min, max, description}] of Object.entries(ranges)) {
        if (value >= min && value <= max) {
            return { key, description };
        }
    }
    return { key: 'undefined', description: 'No data available for the specified range.' };
}

export function categorizeSegmentReport(segmentData){

    const windSpeed = segmentData.averageWindSpeed;// Assuming it's in mph
    const dewPoint = segmentData.averageDewPoint;
    const feelLike = segmentData.averageFeelLike;
    // console.log(feelLike);
    return {
        feelLikeCategory: findCategory(feelLike, feelLikeRanges),
        windCategory: findCategory(windSpeed, windRanges),
        dewCategory: findCategory(dewPoint, dewPointRanges)
    };
}

export function categorizeWeather(weatherData) {
    const windSpeed = weatherData.current.wind_speed; // Assuming it's in mph
    const rainfall = weatherData.daily[0].rain ; // mm per hour
    const dewPoint = weatherData.current.dew_point ;
    const feelLike = weatherData.current.feels_like;
    let windCategory = '';
    let rainCategory = '';
    let dewCategory = '';
    let fellsLikeCategory = '';
    // Determine temperature category

    const findCategory = (value, ranges) => {
        for (const [key, {min, max, description}] of Object.entries(ranges)) {
            if (value >= min && value <= max) {
                return { key, description };
            }
        }
        return { key: 'undefined', description: 'No Data .' };
    };

    return {
        feelLikeCategory: findCategory(feelLike, feelLikeRanges),
        windCategory: findCategory(windSpeed, windRanges),
        rainCategory: findCategory(rainfall, rainRanges),
        dewCategory: findCategory(dewPoint, dewPointRanges)
    };
}