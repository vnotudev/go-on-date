/**
 * Application Configuration
 * Custom date activities, schedule options, and evasive button messages.
 */
const Config = {
    // Your Telegram username (without @) — her answer is sent straight to this chat
    telegramUsername: 'mengvsl',
    maxDodges: 5,
    dodgeMessages: [
        "Nice try! 😉",
        "Too slow! 🚀",
        "Are you sure? 🥺",
        "Wrong button! 💖",
        "YES! (I tried to resist) 😍"
    ],
    vibeOptions: [
        { id: 'coffee', icon: '☕', label: 'Coffee & Treats', desc: 'Cozy bakery & cafe' },
        { id: 'dinner', icon: '🍝', label: 'Cozy Dinner', desc: 'Romantic food & drinks' },
        { id: 'arcade', icon: '🎳', label: 'Arcade Games', desc: 'Fun & games night' },
        { id: 'sunset', icon: '🍦', label: 'Sunset Stroll', desc: 'Ice cream & walks' },
        { id: 'private-movie', icon: '🛋️', label: 'Private Movie', desc: 'Cozy movie night, just us two' },
        { id: 'movie', icon: '🎬', label: 'Movie Date', desc: 'Cinema, popcorn & snacks' }
    ],
    timeOptions: [
        { id: 'weekend', label: '🎉 This Weekend', badge: 'Popular' },
        { id: 'tonight', label: '🌆 Tonight' },
        { id: 'tomorrow', label: '🌤️ Tomorrow' },
        { id: 'midweek', label: '🌙 Mid-week Evening' },
        { id: 'next-weekend', label: '🗓️ Next Weekend' },
        { id: 'surprise', label: '🎁 Surprise Me!' },
        { id: 'custom', label: '📅 Pick a Date on the Calendar', custom: true }
    ],
    timeSlots: [
        { id: 'brunch', emoji: '🥞', label: 'Brunch', hour: 10, minute: 0, period: 'AM' },
        { id: 'lunch', emoji: '🥪', label: 'Lunch', hour: 12, minute: 0, period: 'PM' },
        { id: 'afternoon', emoji: '🍰', label: 'Afternoon', hour: 3, minute: 0, period: 'PM' },
        { id: 'sunset', emoji: '🌅', label: 'Sunset', hour: 6, minute: 0, period: 'PM' },
        { id: 'dinner', emoji: '🍝', label: 'Dinner', hour: 7, minute: 30, period: 'PM' },
        { id: 'late', emoji: '✨', label: 'Late Night', hour: 9, minute: 0, period: 'PM' }
    ]
};
