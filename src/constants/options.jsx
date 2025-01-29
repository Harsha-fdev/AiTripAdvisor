export const SelectTravelList = [
    {
        id: 1,
        title: 'Just Me',
        desc: 'a sole travelers in exploration',
        icon: ' 🧍',
        peoples: '1'
    },

    {
        id: 2,
        title: 'couples',
        desc: 'Two travelers in tandom',
        icon: '👩‍❤️‍👩',
        peoples: '2'
    },

    {
        id: 3,
        title: 'Family',
        desc: 'A group of fun loving adv',
        icon: '👨‍👩‍👧‍👦',
        peoples: '3-5 People'
    },

    {
        id: 4,
        title: 'Friends',
        desc: 'party till the last breathe',
        icon: '🍻 ',
        peoples: 'min-5 people'
    }
]

export const SelectBudgetOptions = [
    {
        id: 1,
        titles: 'Cheap',
        desc: 'Stay conscious of costs',
        icon: '💵'
    },

    {
        id: 2,
        titles: 'Moderate',
        desc: 'Keep cost on the average side',
        icon: ' 💼'
    },

    {
        id: 3,
        titles: 'Luxury',
        desc: 'Dont worry about cost',
        icon: '💎'
    }
]

export const AI_PROMPT = 'Generatae Travel Plan for Location : {Location}, for {totalDays} Days for {traveler} people with a {budget} budget, give me a hotels options list with hotelname , hotel address , price , hotel image url,geo coordinates , rating , description and suggest itinerary with placename , place details , place image url , geo coordinates , ticket , pricing , rating , time travel each for location for {totalDays} days with each day plan with best time to visit in json format'