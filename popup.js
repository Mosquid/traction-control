// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

"use strict";

const textarea = document.getElementById("parasites");
const redirectField = document.getElementById("redirect");
const active = document.getElementById("active");
const btn = document.getElementById("save");

function isValidUrl(site) {
  const regex = new RegExp(
    /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi
  );

  return site.match(regex);
}

function handleOptionsSave() {
  const sites = getSitesArray();
  const redirect = redirectField.value;

  chrome.storage.sync.set(
    { parasites: JSON.stringify(sites), redirect, isActive: active.checked },
    function () {
      btn.innerText = "Saved";
      setTimeout(() => {
        btn.innerText = "Save";
      }, 1000);
    }
  );
}

function getSitesArray() {
  try {
    const sites = textarea.value || "";
    return sites
      .split("\n")
      .map((i) => i.trim())
      .filter(isValidUrl);
  } catch (error) {
    console.log(error);
    return [];
  }
}

function main() {
  chrome.storage.sync.get(
    ["parasites", "redirect", "isActive"],
    ({ parasites, redirect, isActive }) => {
      active.checked = isActive && JSON.parse(isActive);

      if (parasites && parasites.length) {
        textarea.value = JSON.parse(parasites).join("\n");
        redirectField.value = redirect;
      }
    }
  );

  btn.addEventListener("click", handleOptionsSave);
  active.addEventListener("change", (e) => {
    chrome.storage.sync.set({ isActive: e.target.checked });
  });
}

main();
