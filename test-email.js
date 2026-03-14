const { sendVerificationEmail } = require('./src/lib/email');

async function testEmail() {
  console.log("Testing email sending with fallback...");
  try {
    // This will likely trigger the fallback if the domain is still unverified
    await sendVerificationEmail("test@example.com", "test-token-123");
    console.log("Email test call completed. Check email-debug.log for details.");
  } catch (error) {
    console.error("Email test failed:", error);
  }
}

testEmail();
