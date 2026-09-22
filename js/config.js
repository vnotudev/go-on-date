/**
 * Application Configuration
 * Custom date activities, schedule options, and evasive button messages.
 */
const Config = {
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
        { id: 'sunset', icon: '🍦', label: 'Sunset Stroll', desc: 'Ice cream & walks' }
    ],
    timeOptions: [
        { id: 'weekend', label: '🎉 This Weekend', badge: 'Popular' },
        { id: 'midweek', label: '🌙 Mid-week Evening Escape' },
        { id: 'surprise', label: '🎁 Surprise Me!' }
    ]
};
