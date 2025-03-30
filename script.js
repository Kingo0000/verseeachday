document.addEventListener("DOMContentLoaded", function () {
  // Global variables to store current verse and background
  let currentBackgroundUrl = "";
  let currentVerseData = {};

  // Format and display current date
  displayCurrentDate();

  // Fetch background image
  fetchBackgroundImage();

  // Fetch Bible verse, reflection and prayer
  fetchDailyContent();

  // Set up buttons
  document.getElementById("share-btn").addEventListener("click", shareVerse);
  document
    .getElementById("download-devotional")
    .addEventListener("click", downloadDevotional);
  document
    .getElementById("download-image")
    .addEventListener("click", downloadVerseImage);
  document
    .getElementById("new-verse-btn")
    .addEventListener("click", fetchDailyContent);
});

function displayCurrentDate() {
  const now = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = now.toLocaleDateString("en-US", options);
  document.getElementById("current-date").textContent = formattedDate;
}

async function fetchBackgroundImage() {
  try {
    const response = await fetch(
      "https://api.unsplash.com/photos/random?query=nature,peaceful,light&orientation=landscape&client_id=VsrfTWui5jaZYBg6w6iF9w5raGEV41PWAnCrx83oc7Q"
    );
    const data = await response.json();

    if (data && data.urls) {
      currentBackgroundUrl = data.urls.regular;
      document.body.style.backgroundImage = `url(${currentBackgroundUrl})`;
    }
  } catch (error) {
    console.error("Error fetching background image:", error);
    // Fallback to a default background
    currentBackgroundUrl =
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e";
    document.body.style.backgroundImage = `url(${currentBackgroundUrl})`;
  }
}

async function fetchDailyContent() {
  // Show loading state
  document.getElementById("verse-text").textContent =
    "Loading today's verse...";
  document.getElementById("reflection-text").textContent =
    "Loading reflection...";
  document.getElementById("prayer-text").textContent = "Loading prayer...";

  let verseData = null;
  let reflection = null;
  let prayer = null;

  try {
    // First, fetch a random Bible verse
    verseData = await fetchRandomBibleVerse();

    if (verseData) {
      // Store the current verse data globally
      currentVerseData = verseData;

      // Display the verse
      document.getElementById("verse-text").textContent = `"${verseData.text}"`;
      document.getElementById("verse-reference").textContent =
        verseData.reference;

      // Generate and display reflection using DeepSeek API
      reflection = await generateReflectionWithAI(
        verseData.text,
        verseData.reference
      );
      document.getElementById("reflection-text").textContent = reflection;

      // Generate and display prayer using DeepSeek API
      prayer = await generatePrayerWithAI(verseData.text, verseData.reference);
      document.getElementById("prayer-text").textContent = prayer;
    }
  } catch (error) {
    console.error("Error fetching daily content:", error);
  } finally {
    if (!verseData || !reflection || !prayer) {
      useFallbackContent();
    }
  }
}

async function fetchRandomBibleVerse() {
  try {
    // Try fetching from Bible API
    const response = await fetch("https://bible-api.com/?random=verse");
    const data = await response.json();

    if (data && data.text && data.reference) {
      return {
        text: data.text.trim(),
        reference: data.reference,
      };
    }

    throw new Error("Invalid response from Bible API");
  } catch (error) {
    console.error("Error fetching from Bible API:", error);

    // Alternative approach: fetch from ESV API if you have a key
    // This requires an API key from https://api.esv.org/
    try {
      const esvResponse = await fetch(
        "https://api.esv.org/v3/passage/text/?q=random",
        {
          headers: {
            Authorization: "Token f1b15d981e39493c9b87b874e2d698c2d72f8b1d",
          },
        }
      );
      const esvData = await esvResponse.json();

      if (esvData && esvData.passages && esvData.passages.length > 0) {
        // Extract reference from the passage
        const reference = esvData.canonical;
        const text = esvData.passages[0].trim();

        return {
          text: text,
          reference: reference,
        };
      }
    } catch (esvError) {
      console.error("Error fetching from ESV API:", esvError);
    }

    // If all APIs fail, use a fallback verse
    return getFallbackVerse();
  }
}

function getFallbackVerse() {
  const fallbackVerses = [
    {
      text: "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.",
      reference: "John 3:16",
    },
    {
      text: "Trust in the LORD with all your heart, and do not lean on your own understanding. In all your ways acknowledge him, and he will make straight your paths.",
      reference: "Proverbs 3:5-6",
    },
    {
      text: "I can do all things through him who strengthens me.",
      reference: "Philippians 4:13",
    },
    {
      text: "Be strong and courageous. Do not fear or be in dread of them, for it is the LORD your God who goes with you. He will not leave you or forsake you.",
      reference: "Deuteronomy 31:6",
    },
    {
      text: "The LORD is my shepherd; I shall not want. He makes me lie down in green pastures. He leads me beside still waters. He restores my soul.",
      reference: "Psalm 23:1-3",
    },
  ];

  const randomIndex = Math.floor(Math.random() * fallbackVerses.length);
  return fallbackVerses[randomIndex];
}

async function generateReflectionWithAI(verseText, verseReference) {
  try {
    // Using DeepSeek API to generate a reflection
    const response = await fetch(
      "https://api.deepseek.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer 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", // Replace with the user's DeepSeek API key
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content:
                "You are a thoughtful, insightful spiritual guide. Your task is to create a meaningful, encouraging reflection on a Bible verse. The reflection should be 3-5 sentences long, provide context for the verse, explain its meaning, and offer practical application for daily life. Use a warm, compassionate tone.",
            },
            {
              role: "user",
              content: `Please write a reflection on this Bible verse: "${verseText}" - ${verseReference}`,
            },
          ],
          max_tokens: 300,
        }),
      }
    );

    const data = await response.json();

    if (data && data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content.trim();
    } else {
      throw new Error("Invalid response from DeepSeek API");
    }
  } catch (error) {
    console.error("Error generating reflection with AI:", error);
    return getFallbackReflection(verseText);
  }
}

async function generatePrayerWithAI(verseText, verseReference) {
  try {
    // Using DeepSeek API to generate a prayer
    const response = await fetch(
      "https://api.deepseek.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer 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", // Replace with the user's DeepSeek API key
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content:
                "You are a compassionate spiritual guide. Your task is to create a short, heartfelt prayer based on a Bible verse. The prayer should be 3-4 sentences long, personal, and relate directly to the verse's message. End with 'Amen.'",
            },
            {
              role: "user",
              content: `Please write a prayer based on this Bible verse: "${verseText}" - ${verseReference}`,
            },
          ],
          max_tokens: 200,
        }),
      }
    );

    const data = await response.json();

    if (data && data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content.trim();
    } else {
      throw new Error("Invalid response from DeepSeek API");
    }
  } catch (error) {
    console.error("Error generating prayer with AI:", error);
    return getFallbackPrayer(verseText);
  }
}

function getFallbackReflection(verseText) {
  // Simple keyword-based reflection generation as fallback
  const keywords = {
    love: "God's love is the foundation of our faith. This verse reminds us that divine love is unconditional and ever-present. When we embrace this love, we can extend it to others, creating a ripple effect of compassion in our world.",
    trust:
      "Trust is at the heart of our relationship with God. This verse encourages us to rely not on our limited understanding but on God's infinite wisdom. When we surrender our need to control everything, we open ourselves to divine guidance.",
    strength:
      "We all face moments when our own strength fails us. This verse reminds us that our capacity isn't limited to our own abilities. With God empowering us, we can face life's challenges with renewed courage and resilience.",
    fear: "Fear can paralyze us and prevent us from living fully. This verse assures us that we don't face our fears alone. God's presence gives us the courage to move forward even when the path ahead seems daunting.",
    shepherd:
      "The image of God as our shepherd speaks to His tender care and guidance. This verse reminds us that God provides exactly what we need—rest, nourishment, and restoration. In a world of constant demands, we can find peace in His care.",
  };

  // Check if any keywords are in the verse
  for (const [keyword, reflection] of Object.entries(keywords)) {
    if (verseText.toLowerCase().includes(keyword)) {
      return reflection;
    }
  }

  // Default reflection if no keywords match
  return "This verse reminds us of God's faithfulness throughout all generations. Scripture provides timeless wisdom that speaks to our current circumstances. As we meditate on these words, we can find guidance, comfort, and inspiration for our daily lives.";
}

function getFallbackPrayer(verseText) {
  // Simple keyword-based prayer generation as fallback
  const keywords = {
    love: "Heavenly Father, thank You for Your boundless love that reaches into every corner of my life. Help me to receive this love fully and share it generously with others. May Your love be the foundation of all my thoughts and actions today. Amen.",
    trust:
      "Lord, I surrender my need to understand everything and control my own path. I place my trust in Your perfect wisdom and guidance. Help me to acknowledge You in all my ways and follow where You lead. Amen.",
    strength:
      "God, I acknowledge my weakness and need for Your strength today. Thank You that Your power is made perfect in my weakness. Empower me to face my challenges with the confidence that comes from Your presence working through me. Amen.",
    fear: "Father, when I feel afraid or uncertain, remind me that You are always with me. Give me courage to face this day's challenges, knowing that You will never leave me nor forsake me. Replace my fear with faith in Your unfailing presence. Amen.",
    shepherd:
      "Good Shepherd, thank You for Your tender care for me. Lead me to places of nourishment and rest today. Restore the depleted areas of my life and help me trust Your guidance, knowing You will provide everything I truly need. Amen.",
  };

  // Check if any keywords are in the verse
  for (const [keyword, prayer] of Object.entries(keywords)) {
    if (verseText.toLowerCase().includes(keyword)) {
      return prayer;
    }
  }

  // Default prayer if no keywords match
  return "Heavenly Father, thank You for speaking to me through Your Word. Help me to understand and apply this truth to my life today. Transform my mind and heart through the power of Your Scripture, and guide my steps according to Your will. Amen.";
}

function useFallbackContent() {
  // Use predefined content if APIs fail
  const fallbackData = {
    text: "For I know the plans I have for you, declares the LORD, plans for welfare and not for evil, to give you a future and a hope.",
    reference: "Jeremiah 29:11",
    reflection:
      "God spoke these words to the Israelites during their exile in Babylon—a time of great uncertainty and suffering. Even in their darkest moment, God had a plan for their restoration. This verse reminds us that God's perspective extends beyond our current circumstances. When we face uncertainty or disappointment, we can trust that God sees the complete picture of our lives and is working toward our ultimate good.",
    prayer:
      "Heavenly Father, thank You for having good plans for my life. When I face uncertainty, help me trust that You are working all things together for my good and Your glory. Give me a hopeful perspective that looks beyond my current circumstances to the future You have prepared. Amen.",
  };

  document.getElementById("verse-text").textContent = `"${fallbackData.text}"`;
  document.getElementById("verse-reference").textContent =
    fallbackData.reference;
  document.getElementById("reflection-text").textContent =
    fallbackData.reflection;
  document.getElementById("prayer-text").textContent = fallbackData.prayer;

  // Store for download functionality
  currentVerseData = fallbackData;
}

function shareVerse() {
  const verse = document.getElementById("verse-text").textContent;
  const reference = document.getElementById("verse-reference").textContent;

  if (navigator.share) {
    navigator
      .share({
        title: "Daily Bible Verse",
        text: `${verse} - ${reference}`,
        url: window.location.href,
      })
      .catch((error) => console.error("Error sharing:", error));
  } else {
    // Fallback for browsers that don't support Web Share API
    alert(`Copy this verse:\n\n${verse} - ${reference}`);
  }
}

function downloadDevotional() {
  const date = document.getElementById("current-date").textContent;
  const verse = document.getElementById("verse-text").textContent;
  const reference = document.getElementById("verse-reference").textContent;
  const reflection = document.getElementById("reflection-text").textContent;
  const prayer = document.getElementById("prayer-text").textContent;

  const content = `
Daily Word - ${date}

${verse}
${reference}

TODAY'S REFLECTION:
${reflection}

PRAYER:
${prayer}

May this verse bring peace to your day.
    `;

  // Create a blob and download link
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Daily_Word_${date.replace(/,/g, "").replace(/ /g, "_")}.txt`;
  document.body.appendChild(a);
  a.click();

  // Clean up
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

function downloadVerseImage() {
  const canvas = document.getElementById("verse-canvas");
  const ctx = canvas.getContext("2d");
  const verse = document.getElementById("verse-text").textContent;
  const reference = document.getElementById("verse-reference").textContent;

  // Load background image
  const img = new Image();
  img.crossOrigin = "anonymous"; // Prevent CORS issues

  img.onload = function () {
    // Draw background with overlay
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Add semi-transparent overlay
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set text styles
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";

    // Draw verse text (with word wrapping)
    const maxWidth = canvas.width - 200;
    const lineHeight = 60;
    const x = canvas.width / 2;
    let y = canvas.height / 2 - 60;

    // Verse text (larger)
    ctx.font = '40px "Playfair Display", serif';
    wrapText(ctx, verse, x, y, maxWidth, lineHeight);

    // Reference (smaller, gold color)
    ctx.font = '30px "Source Sans Pro", sans-serif';
    ctx.fillStyle = "#f8c471";
    ctx.fillText(reference, x, canvas.height / 2 + 120);

    // Add "Daily Word" text at the top
    ctx.font = 'bold 50px "Playfair Display", serif';
    ctx.fillStyle = "#f8c471";
    ctx.fillText("Daily Word", x, 80);

    // Convert to image and download
    const dataUrl = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `Daily_Verse_${reference
      .replace(/:/g, "-")
      .replace(/ /g, "_")}.png`;
    document.body.appendChild(a);
    a.click();

    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
    }, 100);
  };

  img.src = currentBackgroundUrl;
}

// Helper function to wrap text on canvas
function wrapText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.replace(/"/g, "").split(" ");
  let line = "";

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, y);
      line = words[n] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }

  context.fillText(line, x, y);
}
