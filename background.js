const DEFAULT_SETTINGS = {
  selectedFilter: "hideImages"
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({ id: "hideImages", title: "이미지 숨기기", type: "radio", contexts: ["all"], checked: true });
  });

  chrome.storage.local.set(DEFAULT_SETTINGS);
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab.id) return;

  chrome.storage.local.set({ selectedFilter: info.menuItemId });

  chrome.storage.local.get(["filterEnabled"], (result) => {
    if (!result.filterEnabled) return;

    chrome.tabs.sendMessage(tab.id, {
      action: info.menuItemId
    });
  });
});

chrome.action.onClicked.addListener((tab) => {
  chrome.storage.local.get(["filterEnabled", "selectedFilter"], (result) => {
    const isEnabled = result.filterEnabled ?? false;
    const newState = !isEnabled;

    chrome.storage.local.set({ filterEnabled: newState });

    chrome.action.setIcon({
      tabId: tab.id,
      path: {
        "128": newState ? "icons/icon128_on.png" : "icons/icon128_off.png"
      }
    });

    chrome.tabs.sendMessage(tab.id, {
      action: newState ? (result.selectedFilter ?? "hideImages") : "disableAllFilters"
    });
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    chrome.storage.local.get(["filterEnabled"], (result) => {
      chrome.action.setIcon({
        tabId,
        path: {
          "128": result.filterEnabled ? "icons/icon128_on.png" : "icons/icon128_off.png"
        }
      });
    });
  }
});