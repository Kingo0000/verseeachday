document.addEventListener("DOMContentLoaded", function () {
  // Format and display current date
  displayCurrentDate();

  // Fetch background image
  fetchBackgroundImage();

  // Fetch Bible verse
  fetchDailyContent();

  // Set up buttons
  document.getElementById("share-btn").addEventListener("click", shareVerse);
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
      document.body.style.backgroundImage = `url(${data.urls.regular})`;
    }
  } catch (error) {
    console.error("Error fetching background image:", error);
    // Fallback to a default background
    document.body.style.backgroundImage = `url(https://images.unsplash.com/photo-1470770841072-f978cf4d019e)`;
  }
}

async function fetchDailyContent() {
  // Show loading state
  document.getElementById("verse-text").textContent =
    "Loading today's verse...";

  try {
    // Fetch a Bible verse
    const verseData = await fetchBibleVerse();

    if (verseData) {
      // Display the verse
      document.getElementById("verse-text").textContent = `"${verseData.text}"`;
      document.getElementById("verse-reference").textContent =
        verseData.reference;
    }
  } catch (error) {
    console.error("Error fetching daily content:", error);
    useFallbackContent();
  }
}

async function fetchBibleVerse() {
  try {
    // First attempt: Use a verse-of-the-day API
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    };

    const response = await fetch(
      "https://beta.ourmanna.com/api/v1/get?format=json&order=daily",
      options
    );

    const data = await response.json();

    if (
      data &&
      data.verse &&
      data.verse.details &&
      data.verse.details.text &&
      data.verse.details.reference
    ) {
      return {
        text: data.verse.details.text.trim(),
        reference: data.verse.details.reference,
      };
    }

    throw new Error("Invalid response from verse-of-the-day API");
  } catch (error) {
    console.error("Error fetching from verse-of-the-day API:", error);

    // Continue with fallback mechanisms...

    // Second attempt: Use bible-api.com with a specific list of message-rich verses
    try {
      // List of message-rich verse references
      const messageRichVerses = [
        "John 3:16",
        "Philippians 4:13",
        "Jeremiah 29:11",
        "Romans 8:28",
        "Psalm 23:1-6",
        "Isaiah 40:31",
        "Matthew 11:28-30",
        "Romans 12:2",
        "2 Corinthians 5:17",
        "Philippians 4:6-7",
        "Joshua 1:9",
        "Isaiah 41:10",
        "Proverbs 3:5-6",
        "Romans 15:13",
        "John 16:33",
        "Psalm 46:1-3",
        "Galatians 5:22-23",
        "Romans 5:3-5",
        "1 Corinthians 13:4-7",
        "Matthew 28:19-20",
        "Psalm 27:1",
        "2 Timothy 1:7",
        "Romans 8:38-39",
        "Hebrews 11:1",
        "James 1:2-4",
        "1 Peter 5:7",
        "Psalm 121:1-2",
        "Matthew 5:14-16",
        "Colossians 3:23-24",
        "Ephesians 2:8-10",
      ];

      // Get a random verse from our curated list
      const randomVerseRef =
        messageRichVerses[Math.floor(Math.random() * messageRichVerses.length)];

      const verseResponse = await fetch(
        `https://bible-api.com/${encodeURIComponent(randomVerseRef)}`
      );
      const verseData = await verseResponse.json();

      if (verseData && verseData.text && verseData.reference) {
        return {
          text: verseData.text.trim(),
          reference: verseData.reference,
        };
      }

      throw new Error("Invalid response from Bible API with curated verse");
    } catch (verseError) {
      console.error("Error fetching curated verse:", verseError);

      // Third attempt: Try the ESV API if available
      try {
        const esvResponse = await fetch(
          "https://api.esv.org/v3/passage/text/?q=John+3:16",
          {
            headers: {
              Authorization: "Token f1b15d981e39493c9b87b874e2d698c2d72f8b1d",
            },
          }
        );
        const esvData = await esvResponse.json();

        if (esvData && esvData.passages && esvData.passages.length > 0) {
          return {
            text: esvData.passages[0].trim(),
            reference: esvData.canonical || "John 3:16",
          };
        }
      } catch (esvError) {
        console.error("Error fetching from ESV API:", esvError);
      }

      // If all APIs fail, use our expanded fallback verses
      return getMessageRichVerse();
    }
  }
}

// Expanded list of message-rich verses as fallback
function getMessageRichVerse() {
  const messageRichVerses = [
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
      text: "For I know the plans I have for you, declares the LORD, plans for welfare and not for evil, to give you a future and a hope.",
      reference: "Jeremiah 29:11",
    },
    {
      text: "And we know that for those who love God all things work together for good, for those who are called according to his purpose.",
      reference: "Romans 8:28",
    },
    {
      text: "But those who wait for the LORD shall renew their strength; they shall mount up with wings like eagles; they shall run and not be weary; they shall walk and not faint.",
      reference: "Isaiah 40:31",
    },
    {
      text: "Come to me, all who labor and are heavy laden, and I will give you rest. Take my yoke upon you, and learn from me, for I am gentle and lowly in heart, and you will find rest for your souls.",
      reference: "Matthew 11:28-29",
    },
    {
      text: "Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God. And the peace of God, which surpasses all understanding, will guard your hearts and your minds in Christ Jesus.",
      reference: "Philippians 4:6-7",
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

  const randomIndex = Math.floor(Math.random() * messageRichVerses.length);
  return messageRichVerses[randomIndex];
}

function useFallbackContent() {
  const verseData = getMessageRichVerse();
  document.getElementById("verse-text").textContent = `"${verseData.text}"`;
  document.getElementById("verse-reference").textContent = verseData.reference;
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
