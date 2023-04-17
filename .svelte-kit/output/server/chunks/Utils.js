const clipToRange = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};
const clipTo0 = (value) => {
  return Math.max(value, 0);
};
const Wait = {
  forNull: async function(variable, interval = 100) {
    console.log("waiting for null...");
    await new Promise((resolve) => {
      const timer = setInterval(() => {
        if (variable !== null) {
          console.log("Not Null!");
          clearInterval(timer);
          resolve();
        }
      }, interval);
    });
  },
  forTrue: async function(variable, interval = 100) {
    console.log("waiting for true...");
    await new Promise((resolve) => {
      const timer = setInterval(() => {
        if (variable === true) {
          console.log("Truthy!");
          clearInterval(timer);
          resolve();
        }
      }, interval);
    });
  }
};
function channelExtensionFor(channel) {
  return `.channel.${channel.toString()}`;
}
const Utils = {
  generateRandomKey() {
    return Math.random().toString(36);
  },
  formatDate(date) {
    const dateObj = new Date(date);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return dateObj.toLocaleDateString("en-US", options);
  },
  camelCaseNoWhiteSpace(str) {
    let camelCaseStr = str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return word.toUpperCase();
    }).replace(/\s+/g, "");
    return camelCaseStr.replace(/\s+/g, "");
  },
  trimAndAddReadMoreLink(content, cutOffIndex = 200) {
    const trimmedContent = content.substring(0, cutOffIndex);
    let lastTagIndex = trimmedContent.lastIndexOf(">");
    lastTagIndex = lastTagIndex < 4 ? trimmedContent.length : lastTagIndex + 1;
    const trimmedContentWithReadMore = trimmedContent.substring(0, lastTagIndex) + ' <a class=" !no-underline hover:!text-secondary-400 text-xs" href="/">…Read More</a>';
    return trimmedContentWithReadMore;
  },
  repeatChar(char, i) {
    let str = "";
    for (let j = 0; j < i; j++) {
      str += char;
    }
    return str;
  },
  scrambleString(str) {
    let a = str.split(""), n = a.length;
    for (let i = n - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a.join("");
  },
  rotateString(str) {
    if (str.length <= 1) {
      return str;
    }
    const rotatedStr = Array.from(str);
    for (let i = 0; i < str.length; i++) {
      const newIndex = (i + 1) % str.length;
      rotatedStr[newIndex] = str[i];
    }
    return rotatedStr.join("");
  }
};
export {
  Utils as U,
  Wait as W,
  clipTo0 as a,
  clipToRange as b,
  channelExtensionFor as c
};
