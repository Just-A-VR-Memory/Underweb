function saveFight() {
  let json = document.getElementById("jsonArea").value;
  try {
    let parsed = JSON.parse(json);
    parsed.script = fightEditor.getValue();
    let blob = new Blob([JSON.stringify(parsed, null, 2)], {type:"application/json"});
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = "custom_fight.json";
    a.click();
  } catch(e) {
    alert("Invalid JSON!");
  }
}

require.config({ paths: { vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.38.0/min/vs" }});
require(["vs/editor/editor.main"], function () {
  window.fightEditor = monaco.editor.create(document.getElementById("editor"), {
    value: "// Custom fight script goes here\n",
    language: "javascript",
    theme: "vs-dark"
  });
});
