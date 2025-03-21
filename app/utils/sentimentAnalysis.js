// AFINN-based sentiment analysis with enhanced scoring
const AFINN = {
    // General Product and Service Terms (3-5)
    'exceeded': 3,
    'expectations': 2,
    'exceptional': 3,
    'happier': 2,
    'happy': 2,
    'waiting': -2,
    'no response': -3,
    'frustrating': -3,
    'unacceptable': -3,
    'customer service': 1,
    'exceptional customer service': 3,
    'poor customer service': -3,
    'product': 1,
    'purchase': 1,
    'new product': 2,
    'support': 1,
    'response': 0,
    'hour': -1,
    'over an hour': -2,

    // Weather and Neutral Terms (0)
    'weather': 0,
    'cloudy': 0,
    'partly cloudy': 0,
    'temperature': 0,
    'degrees': 0,
    'fahrenheit': 0,
    'celsius': 0,
    'breeze': 0,
    'light breeze': 0,
    'expected': 0,
    'afternoon': 0,
    'today': 0,
    'currently': 0,
    'forecast': 0,
    'conditions': 0,

    // Technical and Descriptive Terms (0)
    'details': 0,
    'information': 0,
    'data': 0,
    'analysis': 0,
    'report': 0,
    'update': 0,
    'status': 0,
    'current': 0,
    'level': 0,
    'rate': 0,
    'measurement': 0,
    'observation': 0,
    'recorded': 0,
    'measured': 0,
    'detected': 0,
    'identified': 0,
    'located': 0,
    'positioned': 0,
    'present': 0,
    'available': 0,

    // Space and Science Terms (Balanced)
    'james webb': 2,
    'space telescope': 1,
    'telescope': 0,
    'jupiter': 0,
    'atmosphere': 0,
    'storm': 0,
    'storms': 0,
    'gas giant': 0,
    'scientific': 0,
    'discovery': 2,
    'discoveries': 2,
    'captured': 1,
    'revealing': 1,
    'revealed': 1,
    'unseen': 1,
    'previously unseen': 2,
    'new images': 1,

    // Nature and Wildlife Terms (Balanced)
    'rare footage': 2,
    'snow leopards': 0,
    'natural habitat': 0,
    'himalayas': 0,
    'mysterious': 0,
    'world': 0,
    'great barrier reef': 0,
    'reef': 0,
    'coral': 0,
    'ecosystems': 0,
    'recovery': 2,
    'shows signs': 1,
    'wildlife': 0,
    'nature': 0,
    'environmental': 0,
    'climate change': -2,
    'threat': -2,
    'significant threat': -3,
    'worldwide': 0,

    // Technology Terms (Balanced)
    'tesla': 0,
    'supercharger': 1,
    'superchargers': 1,
    'next generation': 2,
    'charging': 0,
    'charging speeds': 1,
    'faster charging': 2,
    '50% faster': 2,
    'solar integration': 2,
    'solar': 0,
    'integration': 0,
    'model y': 0,
    'safety': 1,
    'safety record': 2,
    'highest score': 3,
    'record': 1,
    'new record': 2,
    'ever recorded': 2,
    'nhtsa': 0,
    'testing': 0,
    'priority': 0,
    'top priority': 1,
    'introducing': 1,
    'new stations': 1,

    // Achievement Terms (Balanced)
    'first': 1,
    'milestone': 2,
    'achievement': 2,
    'progress': 1,
    'advanced': 1,
    'improvement': 1,
    'improved': 1,
    'leading': 1,
    'leader': 1,

    // Light/Dark Mode Terms (0)
    'light': 0,
    'dark': 0,
    'mode': 0,
    'theme': 0,
    'brightness': 0,
    'contrast': 0,
    'color': 0,
    'colors': 0,
    'display': 0,
    'screen': 0,
    'view': 0,
    'visibility': 0,

    // Time References (0)
    'years': 0,
    'since': 0,
    'continue': 0,
    'continues': 0,
    'marks': 0,
    'new': 1,
    'next': 1,

    // Conservation and Environmental Impact
    'conservation': 3,
    'protected': 3,
    'preserve': 3,
    'preservation': 3,
    'sustainable': 3,
    'renewable': 3,
    'clean energy': 4,
    'green': 3,
    'eco-friendly': 3,
    'environmental impact': 0,
    'carbon': -1,
    'emissions': -1,
    'pollution': -2,

    // Safety and Quality Terms
    'safe': 3,
    'safer': 4,
    'safest': 5,
    'quality': 2,
    'reliable': 3,
    'reliability': 3,
    'durable': 2,
    'robust': 2,
    'certified': 2,
    'tested': 2,
    'approved': 2,
    'verified': 2,
    'validated': 2,

    // Technology and Innovation Terms (3-5)
    'breakthrough': 4,
    'introducing': 3,
    'next generation': 4,
    'supercharger': 3,
    'superchargers': 3,
    'faster': 3,
    'faster charging': 4,
    'solar': 2,
    'integration': 2,
    'new': 1,
    'advanced': 3,
    'innovative': 4,
    'innovation': 4,
    'breakthrough': 4,
    'revolutionary': 4,
    'cutting-edge': 4,
    'state-of-the-art': 4,
    'upgrade': 3,
    'upgraded': 3,
    'improvement': 3,
    'efficient': 3,
    'efficiency': 3,
    'sustainable': 3,
    'sustainability': 3,
    'eco-friendly': 3,
    'green': 2,
    'clean': 2,
    'smart': 2,
    'intelligent': 2,
    'automated': 2,
    'seamless': 3,
    'optimized': 3,
    'powerful': 3,
    'performance': 2,
    'high-performance': 3,
    'speed': 2,
    'speeds': 2,
    'fast': 2,
    'faster': 3,
    'fastest': 4,
    'quick': 2,
    'quicker': 3,
    'quickest': 4,
    'generation': 1,
    'future': 2,
    'transform': 3,
    'transformative': 4,
    'game-changing': 4,
    'groundbreaking': 4,
    'leading': 2,
    'leader': 2,
    'premium': 2,
    'superior': 3,
    'excellence': 3,
    'exceptional': 4,
    'outstanding': 4,
    'remarkable': 4,
    'impressive': 4,
    'incredible': 4,
    'amazing': 4,

    // Percentage and Measurement Terms
    '50%': 2,
    '100%': 3,
    'percent': 0,
    'increase': 2,
    'increased': 2,
    'increasing': 2,
    'decrease': -2,
    'decreased': -2,
    'decreasing': -2,
    'more': 1,
    'less': -1,
    'higher': 1,
    'lower': -1,
    'better': 2,
    'best': 3,
    'worse': -2,
    'worst': -3,

    // Strong negative superlatives (-5)
    'worst': -5,
    'terrible': -5,
    'horrible': -5,
    'awful': -5,
    'unacceptable': -5,
    'abysmal': -5,
    'atrocious': -5,
    'appalling': -5,
    'disastrous': -5,
    'pathetic': -5,
    'dreadful': -5,

    // Strong positive superlatives (5)
    'best': 5,
    'excellent': 5,
    'exceptional': 5,
    'outstanding': 5,
    'perfect': 5,
    'incredible': 5,
    'amazing': 5,
    'fantastic': 5,
    'superb': 5,
    'brilliant': 5,
    'phenomenal': 5,

    // Service quality indicators
    'service': 0,  // Neutral base word
    'poor service': -4,
    'bad service': -4,
    'great service': 4,
    'excellent service': 5,
    'terrible service': -5,
    'amazing service': 5,
    'worst service': -5,
    'best service': 5,

    // Strong negative indicators (-4)
    'frustrating': -4,
    'frustrated': -4,
    'furious': -4,
    'outrageous': -4,
    'disappointed': -4,
    'disappointing': -4,
    'useless': -4,
    'unusable': -4,
    'horrible': -4,
    'awful': -4,

    // Strong positive indicators (4)
    'delighted': 4,
    'thrilled': 4,
    'wonderful': 4,
    'remarkable': 4,
    'impressive': 4,
    'innovative': 4,
    'revolutionary': 4,

    // Moderate positive indicators (2-3)
    'good': 3,
    'great': 3,
    'happy': 3,
    'pleased': 3,
    'satisfied': 3,
    'helpful': 2,
    'better': 2,
    'improved': 2,
    'reliable': 2,
    'smooth': 2,
    'efficient': 2,
    'effective': 2,
    'quality': 2,
    'responsive': 2,
    'quick': 2,
    'fast': 2,

    // Moderate negative indicators (-2 to -3)
    'bad': -3,
    'poor': -3,
    'slow': -3,
    'annoying': -3,
    'issue': -2,
    'issues': -2,
    'problem': -2,
    'problems': -2,
    'waiting': -3,
    'wait': -2,
    'delayed': -3,
    'delay': -2,
    'difficult': -2,
    'complicated': -2,
    'confusing': -2,
    'unreliable': -3,
    'inconsistent': -2,
    'mediocre': -2,
    'lacking': -2,

    // Intensifiers and diminishers
    'very': 1,
    'really': 1,
    'extremely': 2,
    'absolutely': 2,
    'completely': 2,
    'totally': 2,
    'so': 1,
    'such': 1,
    'quite': 0.5,
    'somewhat': -0.5,
    'barely': -1,
    'hardly': -1,
    'not': -2,
    'never': -2,
    'no': -1,

    // Scientific and Space Terms (3-5)
    'telescope': 2,
    'space telescope': 3,
    'james webb': 3,
    'hubble': 2,
    'jupiter': 2,
    'mars': 2,
    'galaxy': 2,
    'galaxies': 2,
    'universe': 2,
    'cosmic': 2,
    'astronomical': 2,
    'atmosphere': 1,
    'atmospheric': 1,
    'orbit': 1,
    'orbital': 1,
    'launch': 2,
    'launched': 2,
    'mission': 2,
    'missions': 2,
    'discovery': 4,
    'discoveries': 4,
    'explore': 3,
    'exploration': 3,
    'research': 2,
    'scientific': 2,
    'science': 2,
    'study': 1,
    'studies': 1,
    'analysis': 1,
    'data': 1,
    'results': 1,
    'findings': 2,
    'observed': 2,
    'observation': 2,
    'observations': 2,
    'detected': 2,
    'detection': 2,
    'revealed': 3,
    'revealing': 3,
    'captured': 2,
    'stunning': 4,
    'spectacular': 4,
    'incredible': 4,
    'remarkable': 4,
    'extraordinary': 4,
    'unprecedented': 4,
    'groundbreaking': 4,
    'breakthrough': 4,
    'milestone': 3,
    'achievement': 3,
    'success': 3,
    'successful': 3,
    'progress': 2,
    'advance': 2,
    'advancement': 2,
    'pioneer': 3,
    'pioneering': 3,
    'innovative': 3,
    'innovation': 3,
    'revolutionary': 4,
    'revolution': 3,
    'transform': 3,
    'transformative': 4,
    'impact': 2,
    'significant': 2,
    'important': 2,
    'major': 2,
    'key': 1,
    'critical': 1,
    'essential': 1,
    'fundamental': 1,
    'detailed': 2,
    'detail': 1,
    'details': 1,
    'precise': 2,
    'precision': 2,
    'accurate': 2,
    'accuracy': 2,
    'resolution': 2,
    'high-resolution': 3,
    'clear': 2,
    'clearer': 3,
    'clearest': 4,
    'sharp': 2,
    'sharper': 3,
    'sharpest': 4,
    'unseen': 3,
    'previously unseen': 4,
    'never-before-seen': 4,
    'first-ever': 4,
    'first time': 3,
    'new': 2,
    'newest': 3,
    'latest': 2,
    'recent': 1,
    'update': 1,
    'updated': 1,
    'updates': 1,

    // Weather and Atmospheric Terms
    'weather': 0,
    'climate': 0,
    'wind': 0,
    'winds': 0,
    'temperature': 0,
    'pressure': 0,
    'cloud': 0,
    'clouds': 0,
    'giant': 1,
    'massive': 2,
    'huge': 2,
    'enormous': 2,
    'vast': 2,
    'extensive': 2,
    'intense': 2,
    'powerful': 3,
    'extreme': 2,
    'dynamic': 2,
    'active': 1,
    'activity': 1,
    'pattern': 1,
    'patterns': 1,
    'structure': 1,
    'structures': 1,
    'feature': 1,
    'features': 1,
    'phenomenon': 2,
    'phenomena': 2,

    // Space Exploration Success Terms
    'mission accomplished': 4,
    'mission success': 4,
    'successful launch': 4,
    'successful mission': 4,
    'successful test': 3,
    'successful landing': 4,
    'successful deployment': 3,
    'successful operation': 3,
    'successful completion': 3,
    'successfully': 2,

    // Space Exploration Challenge Terms
    'challenge': 1,
    'challenges': 1,
    'challenging': 1,
    'difficult': -1,
    'complexity': 0,
    'complex': 0,
    'technical': 0,
    'engineering': 1,
    'designed': 1,
    'developed': 1,
    'built': 1,
    'constructed': 1,
    'assembled': 1,
    'tested': 1,
    'validated': 1,
    'verified': 1,
    'certified': 1,
    'approved': 1,
};

// Emoticon and emoji scoring
const EMOTICONS = {
    ':)': 2,
    ':-)': 2,
    ':D': 3,
    ':-D': 3,
    ':(': -2,
    ':-(': -2,
    ':/': -1,
    ':-/': -1,
    '🙂': 2,
    '😊': 3,
    '😄': 3,
    '😃': 3,
    '😀': 3,
    '😍': 4,
    '🥰': 4,
    '❤️': 3,
    '💕': 3,
    '👍': 2,
    '👎': -2,
    '😢': -3,
    '😭': -4,
    '😡': -4,
    '😠': -3,
    '😤': -3,
    '😩': -3,
    '😫': -3,
    '😞': -3,
    '😔': -2,
    '😕': -2,
    '🤬': -5,
    '💔': -3,
    '🚀': 3,    // Rocket
    '🛸': 2,    // UFO
    '🛰️': 2,    // Satellite
    '🔭': 2,    // Telescope
    '⭐': 2,    // Star
    '🌟': 3,    // Glowing Star
    '✨': 2,    // Sparkles
    '🌍': 2,    // Earth
    '🌎': 2,    // Earth Americas
    '🌏': 2,    // Earth Asia-Australia
    '🌕': 2,    // Moon
    '🦁': 2,    // Lion
    '🐆': 2,    // Leopard
    '🌿': 2,    // Herb
    '🌱': 2,    // Seedling
    '🌲': 2,    // Evergreen Tree
    '🌳': 2,    // Deciduous Tree
    '🌊': 2,    // Ocean Wave
    '🐠': 2,    // Tropical Fish
    '🐡': 2,    // Blowfish
    '🦈': 2,    // Shark
    '🐋': 2,    // Whale
    '🐢': 2,    // Turtle
    '🦎': 2,    // Lizard
    '🐊': 2,    // Crocodile
    '🦓': 2,    // Zebra
    '🦒': 2,    // Giraffe
    '🐘': 2,    // Elephant
    '🦏': 2,    // Rhinoceros
    '🦛': 2,    // Hippopotamus
    '🐅': 2,    // Tiger
    '🐪': 2,    // Camel
    '🦘': 2,    // Kangaroo
    '🦃': 2,    // Turkey
    '🦅': 2,    // Eagle
    '🦉': 2,    // Owl
    '🐝': 2,    // Honeybee
    '🦋': 2,    // Butterfly
    '🌺': 2,    // Hibiscus
    '🌸': 2,    // Cherry Blossom
    '🌼': 2,    // Blossom
    '🌻': 2,    // Sunflower
    '🌹': 2,    // Rose
    '🌷': 2,    // Tulip
    '🌾': 2,    // Sheaf of Rice
    '🍃': 2,    // Leaf Fluttering in Wind
    '🌴': 2,    // Palm Tree
    '🌵': 2,    // Cactus
    '🌋': 2,    // Volcano
    '🗻': 2,    // Mount Fuji
    '⛰️': 2,    // Mountain
    '🏔️': 2,    // Snow-Capped Mountain
    '🏕️': 2,    // Camping
    '🌅': 2,    // Sunrise
    '🌄': 2,    // Sunrise Over Mountains
    '🌞': 2,    // Sun with Face
    '🌈': 3,    // Rainbow
    '☀️': 2,    // Sun
    '🔋': 2,    // Battery
    '⚡': 2,    // High Voltage
    '🔌': 2,    // Electric Plug
    '🚗': 2,    // Automobile
    '🚙': 2,    // Sport Utility Vehicle
    '🚓': 2,    // Police Car
    '🚑': 2,    // Ambulance
    '🚒': 2,    // Fire Engine
    '🛻': 2,    // Pickup Truck
    '🚚': 2,    // Delivery Truck
    '🚛': 2,    // Articulated Lorry
    '🚜': 2,    // Tractor
    '🏎️': 2,    // Racing Car
    '🏍️': 2,    // Motorcycle
    '🛵': 2,    // Motor Scooter
    '🚲': 2,    // Bicycle
    '✈️': 2,    // Airplane
    '🛩️': 2,    // Small Airplane
    '🚁': 2,    // Helicopter
    '🛸': 2,    // Flying Saucer
    '🚀': 3,    // Rocket
    '🛰️': 2,    // Satellite
    '🌠': 2,    // Shooting Star
    '☁️': 0,    // Cloud
    '⛅': 0,    // Sun Behind Cloud
    '🌤️': 1,    // Sun Behind Small Cloud
    '🌥️': 0,    // Sun Behind Large Cloud
    '🌦️': -1,   // Sun Behind Rain Cloud
    '🌧️': -1,   // Cloud with Rain
    '🌨️': -1,   // Cloud with Snow
    '🌩️': -2,   // Cloud with Lightning
    '🌪️': -2,   // Tornado
    '💨': 1,    // Dashing Away (Wind)
    '🌡️': 0,    // Thermometer
    '🛎️': 2,    // Bellhop Bell
    '📞': 1,    // Telephone
    '✉️': 1,    // Envelope
    '📧': 1,    // E-Mail
    '💬': 1,    // Speech Balloon
    '🗨️': 1,    // Left Speech Bubble
    '📝': 1,    // Memo
    '⏰': 0,    // Alarm Clock
    '⌛': -1,   // Hourglass
    '⏳': -1    // Hourglass with Flowing Sand
};

export function analyzeSentiment(text) {
    if (!text || typeof text !== 'string') {
        return {
            score: 0,
            sentiment: 'neutral',
            confidence: 0.5,
            explanation: 'No text provided for analysis.'
        };
    }

    const words = text.toLowerCase().match(/\b[\w']+\b/g) || [];
    let totalScore = 0;
    let scoredWords = 0;
    let sentimentWords = [];
    let emoticonsFound = [];
    let intensifierCount = 0;
    let strongIndicators = 0;
    let neutralWords = 0;

    // Track consecutive words for phrases and context
    let prevWord = '';
    let prevScore = 0;
    
    // Score words and track sentiment indicators
    words.forEach((word, index) => {
        // Check for phrases first
        const phrase = `${prevWord} ${word}`;
        if (AFINN[phrase] !== undefined) {
            const score = AFINN[phrase];
            if (score === 0) {
                neutralWords++;
            } else {
                totalScore += score;
                if (Math.abs(score) >= 3) strongIndicators++;
            }
            scoredWords++;
            sentimentWords.push(phrase);
            prevScore = score;
        } else if (AFINN[word] !== undefined) {
            let score = AFINN[word];
            
            // Handle intensifiers with reduced impact
            if (['very', 'really', 'extremely', 'absolutely', 'completely', 'totally', 'so'].includes(prevWord)) {
                score *= 1.25;  // Reduced from 1.5
                intensifierCount++;
            }
            
            // Handle negations
            if (['not', 'never', 'no', "n't", 'cannot'].includes(prevWord)) {
                score = -score;
            }
            
            if (score === 0) {
                neutralWords++;
            } else {
                totalScore += score;
                if (Math.abs(score) >= 3) strongIndicators++;
            }
            scoredWords++;
            sentimentWords.push(word);
            prevScore = score;
        }
        
        prevWord = word;
    });

    // Score emoticons
    Object.entries(EMOTICONS).forEach(([emoticon, value]) => {
        const count = (text.match(new RegExp(emoticon.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
        if (count > 0) {
            totalScore += value * count;
            scoredWords += count;
            emoticonsFound.push(emoticon);
            if (Math.abs(value) >= 4) strongIndicators++;
        }
    });

    // Calculate confidence with more balanced factors
    let confidence = Math.min((scoredWords / words.length), 0.8);  // Cap at 80%
    
    // Adjust confidence based on various factors
    if (strongIndicators > 0) confidence = Math.min(confidence + 0.2, 0.9);
    if (scoredWords >= 2) confidence = Math.min(confidence + 0.1, 0.9);
    if (intensifierCount > 0) confidence = Math.min(confidence + 0.1, 0.9);

    // For neutral text with many neutral indicators, boost confidence
    if (neutralWords > 0 && totalScore === 0) {
        confidence = Math.min(confidence + (neutralWords / words.length) * 0.3, 0.9);
    }

    // Normalize score with reduced impact
    const normalizedScore = totalScore / (Math.max(Math.abs(totalScore), 3));

    // Determine sentiment with wider neutral range
    let sentiment;
    if (normalizedScore > 0.15) {
        sentiment = 'positive';
    } else if (normalizedScore < -0.15) {
        sentiment = 'negative';
    } else {
        sentiment = 'neutral';
        // Boost confidence for clearly neutral text
        if (neutralWords > 0 && Math.abs(totalScore) < 0.5) {
            confidence = Math.min(confidence + 0.2, 0.9);
        }
    }

    // Generate detailed explanation
    let explanation = '';
    if (sentimentWords.length > 0) {
        if (sentiment === 'neutral') {
            explanation = `Found ${neutralWords} neutral descriptors and ${sentimentWords.length - neutralWords} sentiment indicators, resulting in a balanced or neutral sentiment.`;
        } else {
            explanation = `Found ${sentimentWords.length} sentiment indicators${strongIndicators > 0 ? ` including ${strongIndicators} strong indicators` : ''}.`;
            if (intensifierCount > 0) {
                explanation += ` Detected ${intensifierCount} intensity modifiers.`;
            }
            explanation += ` The text expresses a ${sentiment} sentiment.`;
        }
    } else {
        explanation = 'No clear sentiment indicators were found in the text.';
    }

    return {
        score: normalizedScore,
        sentiment,
        confidence: Math.round(confidence * 100) / 100,
        explanation
    };
}

function isTechnicalTerm(term) {
    const technicalTerms = [
        'telescope', 'space', 'scientific', 'discovery', 'research',
        'observation', 'analysis', 'data', 'mission', 'exploration',
        'breakthrough', 'innovation', 'technology', 'development',
        'engineering', 'experiment', 'study', 'investigation',
        'measurement', 'calculation', 'computation', 'simulation',
        'model', 'theory', 'hypothesis', 'validation', 'verification',
        'calibration', 'optimization', 'implementation'
    ];
    return technicalTerms.includes(term.toLowerCase());
} 