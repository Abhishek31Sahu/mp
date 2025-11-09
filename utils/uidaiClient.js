export async function authenticateAadhaar(uid, otp) {
  // Simulate a UIDAI response for testing
  console.log(`Mock UIDAI auth for UID: ${uid}`);

  // Example mock: simulate OTP success for test UIDs
  const testUIDs = [
    "999941057058",
    "999971658847",
    "999933119405",
    "999955183433",
    "999990501894",
  ];
  if (testUIDs.includes(uid)) {
    return { success: true, message: "KYC Success (Mocked)" };
  }

  throw new Error("Mock KYC failed - Invalid UID");
}
