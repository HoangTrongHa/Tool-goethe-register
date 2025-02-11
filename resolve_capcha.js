import axios from 'axios';

const api_key = "CAP-FDFF6D277C8874B981E25794A04C3301B6842C8C9423DF63E3856F0BF5828EDE";
const site_key = "6LeI9M4mAAAAAMldyzs_29GsJ5UG5AgFzB8iR24c";
const site_url = "https://www.goethe.de/";

export async function capsolver() {
  const payload = {
    clientKey: api_key,
    task: {
      type: 'ReCaptchaV3TaskProxyLess',
      websiteKey: site_key,
      websiteURL: site_url
    }
  };

  try {
    const res = await axios.post("https://api.capsolver.com/createTask", payload);
    const task_id = res.data.taskId;
    if (!task_id) {
      console.log("Failed to create task:", res.data);
      return;
    }
    console.log("Got taskId:", task_id);

    while (true) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Delay for 1 second

      const getResultPayload = { clientKey: api_key, taskId: task_id };
      const resp = await axios.post("https://api.capsolver.com/getTaskResult", getResultPayload);
      const status = resp.data.status;

      if (status === "ready") {
        return resp.data.solution.gRecaptchaResponse;
      }
      if (status === "failed" || resp.data.errorId) {
        console.log("Solve failed! response:", resp.data);
        return;
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}