"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function SubmitAITool() {
  const router = useRouter();
  const [keyFeatures, setKeyFeatures] = useState([""]);
  const [useCases, setUseCases] = useState([""]);
  const [logo, setLogo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    logo: false,
    thumbnail: false,
  });

  const handleKeyFeaturesChange = (index, value) => {
    const newFeatures = [...keyFeatures];
    newFeatures[index] = value;
    setKeyFeatures(newFeatures);
  };

  const handleUseCasesChange = (index, value) => {
    const newUseCases = [...useCases];
    newUseCases[index] = value;
    setUseCases(newUseCases);
  };

  const addKeyFeature = () => {
    if (keyFeatures.length < 5) {
      setKeyFeatures([...keyFeatures, ""]);
    }
  };

  const addUseCase = () => {
    if (useCases.length < 5) {
      setUseCases([...useCases, ""]);
    }
  };

  const removeKeyFeature = (index) => {
    const newFeatures = keyFeatures.filter((_, i) => i !== index);
    setKeyFeatures(newFeatures);
  };

  const removeUseCase = (index) => {
    const newUseCases = useCases.filter((_, i) => i !== index);
    setUseCases(newUseCases);
  };

  // File handling functions
  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert("File size should be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }
      setLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleThumbnailUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert("File size should be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    const newValidationErrors = {
      logo: !logo,
      thumbnail: !thumbnail,
    };
    setValidationErrors(newValidationErrors);

    if (!logo || !thumbnail) {
      toast.error("Please upload both logo and thumbnail images");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Submitting your AI tool...");

    const formData = new FormData(event.target);
    // Add the files to formData
    formData.append("logo", logo);
    formData.append("thumbnail", thumbnail);
    formData.append(
      "keyFeatures",
      JSON.stringify(keyFeatures.filter((f) => f.trim()))
    );
    formData.append(
      "useCases",
      JSON.stringify(useCases.filter((u) => u.trim()))
    );

    try {
      const response = await fetch("/api/submit-tool", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.dismiss(loadingToast);
        toast.success(
          "Thank you for your submission! We'll review your AI tool and get back to you soon.",
          {
            duration: 5000,
          }
        );

        // Redirect immediately without delay
        router.push("/");
      } else {
        throw new Error(data.error || "Submission failed");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.dismiss(loadingToast);
      toast.error(
        error.message ||
          "Something went wrong while submitting your AI tool. Please try again.",
        {
          duration: 5000,
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black py-12 mb-5">
      {/* Hero section with smaller height */}
      <div className="relative min-h-[300px] flex flex-col items-center justify-center text-center px-4 overflow-hidden hero4-background">
        <div className="grid-perspective">
          <div className="perspective-grid">
            <div className="horizontal-lines" />
          </div>
        </div>

        {/* Gradient sources */}
        <div className="gradient-source-left" />
        <div className="gradient-source-right" />

        {/* Gradient overlay */}
        <div className="gradient-overlay" />

        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-suisse-bold text-white mb-4">
            {" "}
            Submit Your AI Tool
          </h1>
          <p className="text-white/60 font-thin">
            Gain visibility, attract new users, and receive valuable feedback by
            showcasing your AI Agent.
          </p>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto  mt-10 border rounded-xl p-10 border-white/10">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-5">
              <div>
                <Label htmlFor="agentName" className="text-white">
                  AI Agent Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="agentName"
                  name="agentName"
                  placeholder="Enter AI Agent Name"
                  className="bg-black border-white/10 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="websiteUrl" className="text-white">
                  Website URL <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="websiteUrl"
                  name="websiteUrl"
                  placeholder="Enter Website URL"
                  className="bg-black border-white/10 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="linkedinUrl" className="text-white">
                  LinkedIn URL
                </Label>
                <Input
                  id="linkedinUrl"
                  name="linkedinUrl"
                  placeholder="Enter LinkedIn URL"
                  className="bg-black border-white/10 text-white"
                />
              </div>
              <div>
                <Label htmlFor="accessModel" className="text-white">
                  Access Model <span className="text-red-500">*</span>
                </Label>
                <Select name="accessModel" required>
                  <SelectTrigger className="bg-black border-white/10 text-white">
                    <SelectValue placeholder="Select Access Model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="api">API</SelectItem>
                    <SelectItem value="webapp">Web App</SelectItem>
                    <SelectItem value="mobile">Mobile App</SelectItem>
                    <SelectItem value="desktop">Desktop App</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="category" className="text-white">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select name="category" required>
                  <SelectTrigger className="bg-black border-white/10 text-white">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="writing">Writing</SelectItem>
                    <SelectItem value="productivity">Productivity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <Label htmlFor="creatorName" className="text-white">
                  Creator or Organization Name
                </Label>
                <Input
                  id="creatorName"
                  name="creatorName"
                  placeholder="Enter Creator or Organization Name"
                  className="bg-black border-white/10 text-white"
                />
              </div>
              <div>
                <Label htmlFor="emailId" className="text-white">
                  Email Id
                </Label>
                <Input
                  id="emailId"
                  name="emailId"
                  type="email"
                  placeholder="Enter Email Id"
                  className="bg-black border-white/10 text-white"
                />
              </div>
              <div>
                <Label htmlFor="xUrl" className="text-white">
                  X URL
                </Label>
                <Input
                  id="xUrl"
                  name="xUrl"
                  placeholder="Enter X URL"
                  className="bg-black border-white/10 text-white"
                />
              </div>
              <div>
                <Label htmlFor="pricingModel" className="text-white">
                  Pricing Model <span className="text-red-500">*</span>
                </Label>
                <Select name="pricingModel" required>
                  <SelectTrigger className="bg-black border-white/10 text-white">
                    <SelectValue placeholder="Select Pricing Model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="freemium">Freemium</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="industry" className="text-white">
                  Industry <span className="text-red-500">*</span>
                </Label>
                <Select name="industry" required>
                  <SelectTrigger className="bg-black border-white/10 text-white">
                    <SelectValue placeholder="Select Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-white">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Briefly describe your AI Agent, the description is user on your AI Agent page."
              className="bg-black border-white/10 text-white h-32"
            />
          </div>

          {/* Key Features */}
          <div>
            <Label className="text-white block mb-2">
              Key Features{" "}
              <span className="text-sm text-white/60">
                (Enter each feature on a new line. Maximum 5 features
                recommended.)
              </span>
            </Label>
            <div className="space-y-2">
              {keyFeatures.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={feature}
                    onChange={(e) =>
                      handleKeyFeaturesChange(index, e.target.value)
                    }
                    placeholder="Enter one feature per line"
                    className="bg-black border-white/10 text-white"
                  />
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeKeyFeature(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              {keyFeatures.length < 5 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={addKeyFeature}
                  className="text-white hover:text-black hover:bg-white"
                >
                  Add Feature
                </Button>
              )}
            </div>
          </div>

          {/* Use Cases */}
          <div>
            <Label className="text-white block mb-2">
              Use Cases{" "}
              <span className="text-sm text-white/60">
                (Enter each use case on a new line. Maximum 5 use cases
                recommended.)
              </span>
            </Label>
            <div className="space-y-2">
              {useCases.map((useCase, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={useCase}
                    onChange={(e) =>
                      handleUseCasesChange(index, e.target.value)
                    }
                    placeholder="Enter one use case per line"
                    className="bg-black border-white/10 text-white"
                  />
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeUseCase(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              {useCases.length < 5 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={addUseCase}
                  className="text-white hover:text-black hover:bg-white"
                >
                  Add Use Case
                </Button>
              )}
            </div>
          </div>

          {/* File Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-white block mb-2">
                Logo <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="logo-upload"
                  className={`flex flex-col items-center justify-center w-full h-32 border-2 ${
                    validationErrors.logo
                      ? "border-red-500 border-dashed"
                      : "border-white/10 border-dashed"
                  } rounded-lg cursor-pointer bg-black hover:bg-white/5 relative`}
                >
                  {logoPreview ? (
                    <div className="w-full h-full relative">
                      <Image
                        src={logoPreview}
                        alt="Logo preview"
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-white/60" />
                      <p className="text-sm text-white/60">Choose file</p>
                    </div>
                  )}
                  <input
                    id="logo-upload"
                    type="file"
                    className="hidden"
                    onChange={handleLogoUpload}
                    accept="image/*"
                  />
                </label>
              </div>
              <p className="text-sm text-white/60 mt-2">
                Maximum file size: 5MB. Supported formats: PNG, JPG, JPEG.
              </p>
            </div>

            <div>
              <Label className="text-white block mb-2">
                Thumbnail Image <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="thumbnail-upload"
                  className={`flex flex-col items-center justify-center w-full h-32 border-2 ${
                    validationErrors.thumbnail
                      ? "border-red-500 border-dashed"
                      : "border-white/10 border-dashed"
                  } rounded-lg cursor-pointer bg-black hover:bg-white/5 relative`}
                >
                  {thumbnailPreview ? (
                    <div className="w-full h-full relative">
                      <Image
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-white/60" />
                      <p className="text-sm text-white/60">Choose file</p>
                    </div>
                  )}
                  <input
                    id="thumbnail-upload"
                    type="file"
                    className="hidden"
                    onChange={handleThumbnailUpload}
                    accept="image/*"
                  />
                </label>
              </div>
              <p className="text-sm text-white/60 mt-2">
                Maximum file size: 5MB. Supported formats: PNG, JPG, JPEG.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="bg-white text-black hover:bg-white/90 w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </div>
    </div>
  );
}
