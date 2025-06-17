import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    region: "us-east-2",
    userPoolId: "us-east-2_xPBm59gnJ",
    userPoolWebClientId: "3ufu93l0kkb6tg8s0i799qcg4j",
    authenticationFlowType: "USER_PASSWORD_AUTH",
  },
});

async function signIn() {
  try {
    const user = await Auth.signIn("princessdiana2001@hotmail.com", "imasinglel");
    console.log("User signed in:", user);
  } catch (error) {
    console.error("Error signing in:", error);
  }
}

// Call the function
signIn();



cognito.initiateAuth(params, (err, data) => {
  if (err) console.error(err);
  else console.log("Access Token:", data.AuthenticationResult.AccessToken);
});
