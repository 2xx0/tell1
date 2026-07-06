// ===== TELLONYM SPAMMER - v6.0 for Render =====
import fetch from 'node-fetch';

const messages = [
    "يرجاا كل زق", "هههههه يارجال", "والله ما تفهم", "شسالفة هالدنيا",
    "كيفك يا وحش", "تراك فنان", "وش فيك ساكت", "ياعيني عليك",
    "هذا الكلام لازم يتقال", "ضحكتني والله", "لا والله ما أدري",
    "أنت أسطورة", "ههههههههه", "طيب وش بعد؟", "يا سلام عليك",
    "ماشي يا زلمة", "الدنيا غريبة", "ايش السالفة", "ضحكني اليوم",
    "يا رجال والله", "ما يفوتك شي", "ههههههه يا عمري"
];

let successCount = 0;
let failCount = 0;
let totalSent = 0;
let lastMessage = "";

const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m'
};

function getRandomMessage() {
    let randomMsg;
    do {
        randomMsg = messages[Math.floor(Math.random() * messages.length)];
    } while (randomMsg === lastMessage);
    lastMessage = randomMsg;
    return randomMsg;
}

async function sendTell(message) {
    const url = 'https://api.tellonym.me/tells/create';

const headers = {
    'Content-Type': 'application/json;charset=utf-8',
    'Accept': 'application/json',
    'Tellonym-Client': 'ios:3.159.1:2691:26:iPhone12,1',
    'Authorization': process.env.TELLONYM_TOKEN,        // ← من Render
    'User-Agent': 'Tellonym/2691 CFNetwork/3860.200.71 Darwin/25.1.0',
    'Accept-Language': 'ar',
    'Cookie': process.env.TELLONYM_COOKIE               // ← من Render
};

    const body = {
        senderStatus: 0,
        referalId: 0,
        answer: {
            type: 0,
            answer: message,
            tell: message,
            senderStatus: 0,
            sender: {},
            likes: { count: 0, isLiked: false, isLikedBySender: false, previewUsers: [], watchingUserGivenReactions: [], anonGivenReactions: [], previewReactions: [], reactionCounts: {"2":0,"3":0,"4":0,"all":0} },
            media: [],
            comments: { amount: 0, previews: [], privacySetting: 0 }
        },
        previousRouteName: "ScreenProfile",
        contentType: "CUSTOM",
        tell: message,
        userId: 41869015,
        limit: 16
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
        });

        totalSent++;

        if (response.status === 200) {
            successCount++;
            console.log(`${colors.green}✅ [${new Date().toLocaleTimeString()}] "${message}" → Success (200)${colors.reset}`);
        } else {
            failCount++;
            console.log(`${colors.red}❌ [${new Date().toLocaleTimeString()}] "${message}" → Failed (${response.status})${colors.reset}`);
        }

        if (totalSent % 4 === 0) {
            console.log(`${colors.cyan}\n📊 Stats → Total: ${totalSent} | Success: ${successCount} | Failed: ${failCount} | Rate: ${((successCount/totalSent)*100).toFixed(1)}%${colors.reset}\n`);
        }
    } catch (error) {
        failCount++;
        totalSent++;
        console.log(`${colors.red}❌ Connection Error${colors.reset}`);
    }
}

async function startSpamming() {
    console.log(`${colors.cyan}🚀 Spammer Started on Render - 2 messages every 10s\n${colors.reset}`);

    while (true) {
        const msg1 = getRandomMessage();
        await sendTell(msg1);
        await new Promise(r => setTimeout(r, 700));

        const msg2 = getRandomMessage();
        await sendTell(msg2);

        console.log(`${colors.yellow}⏳ Waiting 10 seconds...\n${colors.reset}`);
        await new Promise(r => setTimeout(r, 10000));
    }
}

startSpamming();
