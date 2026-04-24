export async function POST(request) {
  try {
    const formData = await request.formData();

    // Extract data from formData
    const agentName = formData.get("agentName");
    const websiteUrl = formData.get("websiteUrl");
    const linkedinUrl = formData.get("linkedinUrl");
    const accessModel = formData.get("accessModel");
    const category = formData.get("category");
    const creatorName = formData.get("creatorName");
    const emailId = formData.get("emailId");
    const xUrl = formData.get("xUrl");
    const pricingModel = formData.get("pricingModel");
    const industry = formData.get("industry");
    const description = formData.get("description");
    const logo = formData.get("logo");
    const thumbnail = formData.get("thumbnail");
    const keyFeatures = JSON.parse(formData.get("keyFeatures") || "[]");
    const useCases = JSON.parse(formData.get("useCases") || "[]");

    // Validate required fields
    if (
      !agentName ||
      !websiteUrl ||
      !accessModel ||
      !category ||
      !pricingModel ||
      !industry
    ) {
      return new Response(
        JSON.stringify({ error: "Required fields are missing" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Here you would typically:
    // 1. Save the files to your storage (e.g., cloud storage)
    // 2. Save the form data to your database
    // For now, we'll just simulate a successful submission

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return new Response(
      JSON.stringify({
        message: "Tool submitted successfully",
        data: {
          agentName,
          websiteUrl,
          category,
          // ... other fields
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Submission error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
