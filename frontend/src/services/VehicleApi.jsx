const ML_API_URL = "http://localhost:5001";

export async function detectPlate(imageFile) {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await fetch(`${ML_API_URL}/detect-plate`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Plate detection failed");
  }

  return response.json();
}

export async function classifyVehicle(imageFile) {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await fetch(`${ML_API_URL}/classify-vehicle`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Vehicle classification failed");
  }

  return response.json();
}