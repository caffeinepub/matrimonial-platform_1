import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Camera, Trash2, Upload, CheckCircle, AlertCircle, Edit2, Save, X, Loader2, User, Briefcase, Users, Image
} from "lucide-react";
import { UserProfile } from "../../lib/localStorage";
import {
  useSaveUserProfile,
  useGetUserPhotos,
  useUploadPhoto,
  useDeletePhoto,
} from "../../hooks/useQueries";

interface ProfileSectionProps {
  profile: UserProfile;
}

const RELIGIONS = ["Hindu", "Muslim", "Christian", "Sikh", "Jain", "Buddhist", "Other"];
const MARITAL_STATUSES = ["Never Married", "Divorced", "Widowed", "Awaiting Divorce"];
const MANGLIK_STATUSES = ["Non-Manglik", "Manglik", "Partial Manglik"];
const QUALIFICATIONS = ["10th Pass", "12th Pass", "Diploma", "Graduate", "Post Graduate", "Doctorate", "Other"];
const JOB_TYPES = ["Government", "Private", "Business", "Self Employed", "Not Working", "Other"];
const FAMILY_TYPES = ["Nuclear", "Joint", "Extended"];
const FAMILY_STATUSES = ["Middle Class", "Upper Middle Class", "Rich", "Affluent"];
const STATES = ["Andhra Pradesh", "Bihar", "Delhi", "Gujarat", "Haryana", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal", "Other"];

export default function ProfileSection({ profile }: ProfileSectionProps) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<UserProfile>({ ...profile });
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const saveProfile = useSaveUserProfile();
  const { data: photos = [] } = useGetUserPhotos(profile.id);
  const uploadPhoto = useUploadPhoto();
  const deletePhoto = useDeletePhoto();

  const calculateAge = (dob: string): number => {
    if (!dob) return 0;
    const today = new Date();
    const birth = new Date(dob);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const handleDobChange = (dob: string) => {
    setForm((f) => ({ ...f, dateOfBirth: dob, age: calculateAge(dob) }));
  };

  const handleSave = async () => {
    setSaveError("");
    try {
      await saveProfile.mutateAsync(form);
      setSaveSuccess(true);
      setEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e: any) {
      setSaveError(e.message);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadProgress(0);
    try {
      // Compress image client-side
      const compressed = await compressImage(file, (p) => setUploadProgress(p));
      await uploadPhoto.mutateAsync({ userId: profile.id, imageData: compressed });
      setUploadProgress(null);
    } catch (err: any) {
      setUploadProgress(null);
      setSaveError("Photo upload failed: " + err.message);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const compressImage = (file: File, onProgress: (p: number) => void): Promise<Uint8Array> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX = 800;
          let { width, height } = img;
          if (width > MAX || height > MAX) {
            if (width > height) { height = (height * MAX) / width; width = MAX; }
            else { width = (width * MAX) / height; height = MAX; }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(img, 0, 0, width, height);
          onProgress(80);
          canvas.toBlob((blob) => {
            if (!blob) { reject(new Error("Compression failed")); return; }
            blob.arrayBuffer().then((buf) => {
              onProgress(100);
              resolve(new Uint8Array(buf) as unknown as Uint8Array);
            });
          }, "image/jpeg", 0.8);
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleDeletePhoto = async (photoId: string) => {
    await deletePhoto.mutateAsync({ photoId, userId: profile.id });
  };

  const photoCount = photos.length;
  const photosNeeded = Math.max(0, 4 - photoCount);

  const f = editing ? form : profile;

  return (
    <div className="space-y-6">
      {/* Profile Status Banner */}
      <div className={`p-4 rounded-lg border flex items-center justify-between ${
        profile.status === "approved" ? "bg-green-50 border-green-200" :
        profile.status === "pending" ? "bg-yellow-50 border-yellow-200" :
        "bg-red-50 border-red-200"
      }`}>
        <div className="flex items-center gap-2">
          {profile.status === "approved" ? <CheckCircle className="w-5 h-5 text-green-600" /> : <AlertCircle className="w-5 h-5 text-yellow-600" />}
          <span className="font-medium">
            Profile Status: <span className="capitalize">{profile.status}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          {profile.isVisible ? (
            <Badge className="bg-green-100 text-green-700 border-green-300">Visible to Matches</Badge>
          ) : (
            <Badge variant="outline" className="text-yellow-700 border-yellow-300">Hidden (Need 4+ Photos)</Badge>
          )}
        </div>
      </div>

      {saveSuccess && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <AlertDescription className="text-green-700">Profile saved successfully!</AlertDescription>
        </Alert>
      )}
      {saveError && (
        <Alert variant="destructive">
          <AlertDescription>{saveError}</AlertDescription>
        </Alert>
      )}

      {/* Photo Upload Section */}
      <Card className="card-matrimonial">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-serif text-primary flex items-center gap-2">
              <Image className="w-5 h-5" /> Photos
            </CardTitle>
            <Badge variant={photoCount >= 4 ? "default" : "outline"} className={photoCount >= 4 ? "bg-green-100 text-green-700 border-green-300" : "text-yellow-700 border-yellow-300"}>
              {photoCount}/4 {photoCount < 4 ? `(${photosNeeded} more required)` : "✓ Complete"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {photoCount < 4 && (
            <Alert className="mb-4 bg-yellow-50 border-yellow-200">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <AlertDescription className="text-yellow-700">
                Upload at least 4 photos to make your profile visible to potential matches.
              </AlertDescription>
            </Alert>
          )}
          {photoCount >= 4 && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <AlertDescription className="text-green-700">
                Great! Your profile is now visible to potential matches.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {photos.map((photo) => (
              <div key={photo.id} className="relative group aspect-square rounded-lg overflow-hidden border border-border">
                <img src={photo.url} alt="Profile photo" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    size="icon"
                    variant="destructive"
                    className="w-8 h-8"
                    onClick={() => handleDeletePhoto(photo.id)}
                    disabled={deletePhoto.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                {photo.approved && (
                  <div className="absolute top-1 right-1">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                )}
              </div>
            ))}
            {/* Upload slot */}
            {photos.length < 8 && (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadPhoto.isPending}
                className="aspect-square rounded-lg border-2 border-dashed border-primary/40 flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-colors text-muted-foreground hover:text-primary"
              >
                {uploadPhoto.isPending ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <Camera className="w-6 h-6" />
                    <span className="text-xs font-medium">Add Photo</span>
                  </>
                )}
              </button>
            )}
          </div>

          {uploadProgress !== null && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Uploading... {uploadProgress}%</p>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploadPhoto.isPending} className="w-full">
            <Upload className="w-4 h-4 mr-2" />
            {uploadPhoto.isPending ? "Uploading..." : "Upload Photo"}
          </Button>
        </CardContent>
      </Card>

      {/* Profile Edit */}
      <Card className="card-matrimonial">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-serif text-primary">Profile Details</CardTitle>
            {!editing ? (
              <Button variant="outline" size="sm" onClick={() => { setForm({ ...profile }); setEditing(true); }}>
                <Edit2 className="w-4 h-4 mr-2" />Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => { setEditing(false); setSaveError(""); }}>
                  <X className="w-4 h-4 mr-1" />Cancel
                </Button>
                <Button size="sm" className="btn-matrimonial" onClick={handleSave} disabled={saveProfile.isPending}>
                  {saveProfile.isPending ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
                  Save
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="personal">
            <TabsList className="grid grid-cols-3 w-full mb-6">
              <TabsTrigger value="personal" className="flex items-center gap-1"><User className="w-3 h-3" />Personal</TabsTrigger>
              <TabsTrigger value="education" className="flex items-center gap-1"><Briefcase className="w-3 h-3" />Education</TabsTrigger>
              <TabsTrigger value="family" className="flex items-center gap-1"><Users className="w-3 h-3" />Family</TabsTrigger>
            </TabsList>

            {/* Personal Details */}
            <TabsContent value="personal">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Full Name", key: "fullName", type: "text" },
                  { label: "Phone", key: "phone", type: "text", disabled: true },
                ].map(({ label, key, type, disabled }) => (
                  <div key={key}>
                    <Label>{label}</Label>
                    <Input
                      type={type}
                      value={(f as any)[key] ?? ""}
                      onChange={(e) => editing && setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                      disabled={!editing || disabled}
                      className="mt-1"
                    />
                  </div>
                ))}
                <div>
                  <Label>Gender</Label>
                  {editing ? (
                    <Select value={form.gender} onValueChange={(v) => setForm((p) => ({ ...p, gender: v }))}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input value={f.gender} disabled className="mt-1 capitalize" />
                  )}
                </div>
                <div>
                  <Label>Date of Birth</Label>
                  <Input
                    type="date"
                    value={f.dateOfBirth}
                    onChange={(e) => editing && handleDobChange(e.target.value)}
                    disabled={!editing}
                    className="mt-1"
                  />
                  {f.dateOfBirth && <p className="text-xs text-muted-foreground mt-1">Age: {calculateAge(f.dateOfBirth)} years</p>}
                </div>
                {[
                  { label: "Height", key: "height" },
                  { label: "Weight (kg)", key: "weight" },
                  { label: "Caste", key: "caste" },
                  { label: "Sub Caste", key: "subCaste" },
                  { label: "Gotra", key: "gotra" },
                  { label: "Mother Tongue", key: "motherTongue" },
                  { label: "District", key: "district" },
                  { label: "City", key: "city" },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <Label>{label}</Label>
                    <Input
                      value={(f as any)[key] ?? ""}
                      onChange={(e) => editing && setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                      disabled={!editing}
                      className="mt-1"
                    />
                  </div>
                ))}
                {[
                  { label: "Religion", key: "religion", options: RELIGIONS },
                  { label: "Marital Status", key: "maritalStatus", options: MARITAL_STATUSES },
                  { label: "Manglik Status", key: "manglikStatus", options: MANGLIK_STATUSES },
                  { label: "State", key: "state", options: STATES },
                ].map(({ label, key, options }) => (
                  <div key={key}>
                    <Label>{label}</Label>
                    {editing ? (
                      <Select value={(form as any)[key] ?? ""} onValueChange={(v) => setForm((p) => ({ ...p, [key]: v }))}>
                        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>{options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                      </Select>
                    ) : (
                      <Input value={(f as any)[key] ?? ""} disabled className="mt-1" />
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Education & Job */}
            <TabsContent value="education">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Qualification", key: "qualification", options: QUALIFICATIONS },
                  { label: "Job Type", key: "jobType", options: JOB_TYPES },
                ].map(({ label, key, options }) => (
                  <div key={key}>
                    <Label>{label}</Label>
                    {editing ? (
                      <Select value={(form as any)[key] ?? ""} onValueChange={(v) => setForm((p) => ({ ...p, [key]: v }))}>
                        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>{options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                      </Select>
                    ) : (
                      <Input value={(f as any)[key] ?? ""} disabled className="mt-1" />
                    )}
                  </div>
                ))}
                {[
                  { label: "Company / Organization", key: "company" },
                  { label: "Position / Designation", key: "position" },
                  { label: "Work Location", key: "workLocation" },
                  { label: "Monthly Salary (₹)", key: "monthlySalary" },
                  { label: "Annual Income (₹)", key: "annualIncome" },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <Label>{label}</Label>
                    <Input
                      value={(f as any)[key] ?? ""}
                      onChange={(e) => editing && setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                      disabled={!editing}
                      className="mt-1"
                    />
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Family Details */}
            <TabsContent value="family">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Father's Name", key: "fatherName" },
                  { label: "Father's Occupation", key: "fatherOccupation" },
                  { label: "Father's Income (₹/yr)", key: "fatherIncome" },
                  { label: "Father's Phone", key: "fatherPhone" },
                  { label: "Mother's Name", key: "motherName" },
                  { label: "Mother's Occupation", key: "motherOccupation" },
                  { label: "Mother's Income (₹/yr)", key: "motherIncome" },
                  { label: "Mother's Phone", key: "motherPhone" },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <Label>{label}</Label>
                    <Input
                      value={(f as any)[key] ?? ""}
                      onChange={(e) => editing && setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                      disabled={!editing}
                      className="mt-1"
                    />
                  </div>
                ))}
                {[
                  { label: "Number of Brothers", key: "numberOfBrothers", options: ["0","1","2","3","4","5+"] },
                  { label: "Number of Sisters", key: "numberOfSisters", options: ["0","1","2","3","4","5+"] },
                  { label: "Family Type", key: "familyType", options: FAMILY_TYPES },
                  { label: "Family Status", key: "familyStatus", options: FAMILY_STATUSES },
                ].map(({ label, key, options }) => (
                  <div key={key}>
                    <Label>{label}</Label>
                    {editing ? (
                      <Select value={String((form as any)[key] ?? "")} onValueChange={(v) => setForm((p) => ({ ...p, [key]: isNaN(Number(v)) ? v : Number(v) }))}>
                        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>{options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                      </Select>
                    ) : (
                      <Input value={String((f as any)[key] ?? "")} disabled className="mt-1" />
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
