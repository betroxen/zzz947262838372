export default {
  name: "zapway",
  runtime: "node-20.0",
  entrypoint: "src/main.tsx",
  execute: ["any"],
  events: [],
  schedule: "",
  timeout: 30,
  commands: "echo 'No build required'",
  permissions: ["any"]
};