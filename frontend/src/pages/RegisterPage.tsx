import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Phone, Mail, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import {
  useSendPhoneOTP,
  useVerifyPhoneOTP,
  useSendEmailOTP,
  useVerifyEmailOTP,
  useRegister,
} from "../hooks/useQueries";

interface RegisterPageProps {
  onSuccess: () => void;
  onLoginClick: () => void;
}

const RELIGIONS = ["Hindu", "Muslim", "Christian", "Sikh", "Jain", "Buddhist", "Other"];
const MARITAL_STATUSES = ["Never Married", "Divorced", "Widowed", "Awaiting Divorce"];
const MANGLIK_STATUSES = ["Non-Manglik", "Manglik", "Partial Manglik"];
const QUALIFICATIONS = ["10th Pass", "12th Pass", "Diploma", "Graduate", "Post Graduate", "Doctorate", "Other"];
const JOB_TYPES = ["Government", "Private", "Business", "Self Employed", "Not Working", "Other"];
const FAMILY_TYPES = ["Nuclear", "Joint", "Extended"];
const FAMILY_STATUSES = ["Middle Class", "Upper Middle Class", "Rich", "Affluent"];
const STATES = [
  "Andhra Pradesh", "Bihar", "Delhi", "Gujarat", "Haryana", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana",
  "Uttar Pradesh", "West Bengal", "Other",
];

export default function RegisterPage({ onSuccess, onLoginClick }: RegisterPageProps) {
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  // Step 1
  const [phone, setPhone] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [phoneSent, setPhoneSent] = useState(false);
  const [email, setEmail] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");

  // Step 2
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [religion, setReligion] = useState("");
  const [caste, setCaste] = useState("");
  const [subCaste, setSubCaste] = useState("");
  const [gotra, setGotra] = useState("");
  const [motherTongue, setMotherTongue] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [manglikStatus, setManglikStatus] = useState("");

  // Step 3
  const [qualification, setQualification] = useState("");
  const [jobType, setJobType] = useState("");
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [workLocation, setWorkLocation] = useState("");
  const [monthlySalary, setMonthlySalary] = useState("");
  const [annualIncome, setAnnualIncome] = useState("");

  // Step 4
  const [fatherName, setFatherName] = useState("");
  const [fatherOccupation, setFatherOccupation] = useState("");
  const [fatherIncome, setFatherIncome] = useState("");
  const [fatherPhone, setFatherPhone] = useState("");
  const [motherName, setMotherName] = useState("");
  const [motherOccupation, setMotherOccupation] = useState("");
  const [motherIncome, setMotherIncome] = useState("");
  const [motherPhone, setMotherPhone] = useState("");
  const [numberOfBrothers, setNumberOfBrothers] = useState("0");
  const [numberOfSisters, setNumberOfSisters] = useState("0");
  const [familyType, setFamilyType] = useState("");
  const [familyStatus, setFamilyStatus] = useState("");

  const sendPhoneOTP = useSendPhoneOTP();
  const verifyPhoneOTP = useVerifyPhoneOTP();
  const sendEmailOTP = useSendEmailOTP();
  const verifyEmailOTP = useVerifyEmailOTP();
  const register = useRegister();

  const calculateAge = (dob: string): number => {
    if (!dob) return 0;
    const today = new Date();
    const birth = new Date(dob);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const handleSendPhoneOTP = async () => {
    if (!phone || phone.length < 10) { setError("Please enter a valid 10-digit phone number"); return; }
    setError("");
    try {
      await sendPhoneOTP.mutateAsync(phone);
      setPhoneSent(true);
    } catch (e: any) { setError(e.message); }
  };

  const handleVerifyPhoneOTP = async () => {
    setError("");
    try {
      await verifyPhoneOTP.mutateAsync({ phone, otp: phoneOtp });
      setPhoneVerified(true);
    } catch (e: any) { setError(e.message); }
  };

  const handleSendEmailOTP = async () => {
    if (!email) return;
    setError("");
    try {
      await sendEmailOTP.mutateAsync(email);
      setEmailSent(true);
    } catch (e: any) { setError(e.message); }
  };

  const handleVerifyEmailOTP = async () => {
    setError("");
    try {
      await verifyEmailOTP.mutateAsync({ email, otp: emailOtp });
      setEmailVerified(true);
    } catch (e: any) { setError(e.message); }
  };

  const handleStep1Next = () => {
    setError("");
    if (!fullName.trim()) { setError("Full name is required"); return; }
    if (!gender) { setError("Please select gender"); return; }
    if (!phone || phone.length < 10) { setError("Valid phone number is required"); return; }
    if (!phoneVerified) { setError("Please verify your phone number with OTP"); return; }
    if (email && !emailVerified) { setError("Please verify your email or leave it empty"); return; }
    setStep(2);
  };

  const handleStep2Next = () => {
    setError("");
    if (!dateOfBirth) { setError("Date of birth is required"); return; }
    if (!religion) { setError("Religion is required"); return; }
    if (!maritalStatus) { setError("Marital status is required"); return; }
    if (!state) { setError("State is required"); return; }
    setStep(3);
  };

  const handleStep3Next = () => {
    setError("");
    if (!qualification) { setError("Qualification is required"); return; }
    setStep(4);
  };

  const handleFinalSubmit = async () => {
    setError("");
    if (!familyType) { setError("Family type is required"); return; }
    try {
      const age = calculateAge(dateOfBirth);
      // Note: photoCount, isVisible, role, status, id, createdAt, updatedAt are omitted — handled by useRegister
      await register.mutateAsync({
        fullName,
        gender,
        dateOfBirth,
        age,
        height,
        weight,
        religion,
        caste,
        subCaste,
        gotra,
        motherTongue,
        maritalStatus,
        state,
        district,
        city,
        manglikStatus,
        phone,
        email: email || undefined,
        isPhoneVerified: true,
        isEmailVerified: emailVerified,
        qualification,
        jobType,
        company,
        position,
        workLocation,
        monthlySalary,
        annualIncome,
        fatherName,
        fatherOccupation,
        fatherIncome,
        fatherPhone,
        motherName,
        motherOccupation,
        motherIncome,
        motherPhone,
        numberOfBrothers: parseInt(numberOfBrothers) || 0,
        numberOfSisters: parseInt(numberOfSisters) || 0,
        familyType,
        familyStatus,
      });
      onSuccess();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const stepTitles = ["Basic Info & Verification", "Personal Details", "Education & Career", "Family Details"];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <img src="/assets/generated/logo.dim_256x256.png" alt="Logo" className="w-16 h-16 mx-auto mb-3 rounded-full" />
          <h1 className="text-3xl font-bold text-primary font-serif">Create Your Profile</h1>
          <p className="text-muted-foreground mt-1">Step {step} of 4: {stepTitles[step - 1]}</p>
        </div>

        <div className="flex gap-2 mb-6">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`flex-1 h-2 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>

        <Card className="card-matrimonial">
          <CardHeader>
            <CardTitle className="font-serif text-xl text-primary">{stepTitles[step - 1]}</CardTitle>
            {step === 1 && <CardDescription>Enter your basic information and verify your phone number</CardDescription>}
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Step 1 */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter your full name" className="mt-1" />
                  </div>
                  <div>
                    <Label>Gender *</Label>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Select gender" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Phone Verification */}
                <div className="p-4 bg-muted/30 rounded-lg border border-border space-y-3">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    <Label className="font-semibold">Phone Number * (Required)</Label>
                    {phoneVerified && (
                      <Badge className="bg-green-100 text-green-700 border-green-300">
                        <CheckCircle className="w-3 h-3 mr-1" />Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit mobile number" disabled={phoneVerified} maxLength={10} />
                    {!phoneVerified && (
                      <Button variant="outline" onClick={handleSendPhoneOTP} disabled={sendPhoneOTP.isPending || phoneSent} className="whitespace-nowrap">
                        {sendPhoneOTP.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : phoneSent ? "Resend" : "Send OTP"}
                      </Button>
                    )}
                  </div>
                  {phoneSent && !phoneVerified && (
                    <div className="flex gap-2">
                      <Input value={phoneOtp} onChange={(e) => setPhoneOtp(e.target.value)} placeholder="Enter OTP (use 123456)" maxLength={6} />
                      <Button onClick={handleVerifyPhoneOTP} disabled={verifyPhoneOTP.isPending}>
                        {verifyPhoneOTP.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify"}
                      </Button>
                    </div>
                  )}
                  {phoneSent && !phoneVerified && <p className="text-xs text-muted-foreground">Demo OTP: <strong>123456</strong></p>}
                </div>

                {/* Email Verification (Optional) */}
                <div className="p-4 bg-muted/30 rounded-lg border border-border space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    <Label className="font-semibold">Email Address (Optional)</Label>
                    {emailVerified && (
                      <Badge className="bg-green-100 text-green-700 border-green-300">
                        <CheckCircle className="w-3 h-3 mr-1" />Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" disabled={emailVerified} />
                    {email && !emailVerified && (
                      <Button variant="outline" onClick={handleSendEmailOTP} disabled={sendEmailOTP.isPending || emailSent} className="whitespace-nowrap">
                        {sendEmailOTP.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : emailSent ? "Resend" : "Send OTP"}
                      </Button>
                    )}
                  </div>
                  {emailSent && !emailVerified && (
                    <div className="flex gap-2">
                      <Input value={emailOtp} onChange={(e) => setEmailOtp(e.target.value)} placeholder="Enter OTP (use 123456)" maxLength={6} />
                      <Button onClick={handleVerifyEmailOTP} disabled={verifyEmailOTP.isPending}>
                        {verifyEmailOTP.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify"}
                      </Button>
                    </div>
                  )}
                  {emailSent && !emailVerified && <p className="text-xs text-muted-foreground">Demo OTP: <strong>123456</strong></p>}
                </div>

                <Button className="w-full btn-matrimonial" onClick={handleStep1Next}>
                  Continue <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Already registered?{" "}
                  <button onClick={onLoginClick} className="text-primary font-semibold hover:underline">Login here</button>
                </p>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Date of Birth *</Label>
                    <Input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className="mt-1" />
                    {dateOfBirth && <p className="text-xs text-muted-foreground mt-1">Age: {calculateAge(dateOfBirth)} years</p>}
                  </div>
                  <div>
                    <Label>Height</Label>
                    <Input value={height} onChange={(e) => setHeight(e.target.value)} placeholder={`e.g. 5'8"`} className="mt-1" />
                  </div>
                  <div>
                    <Label>Weight (kg)</Label>
                    <Input value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g. 65" className="mt-1" />
                  </div>
                  <div>
                    <Label>Religion *</Label>
                    <Select value={religion} onValueChange={setReligion}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{RELIGIONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Caste</Label>
                    <Input value={caste} onChange={(e) => setCaste(e.target.value)} placeholder="Enter caste" className="mt-1" />
                  </div>
                  <div>
                    <Label>Sub Caste</Label>
                    <Input value={subCaste} onChange={(e) => setSubCaste(e.target.value)} placeholder="Enter sub caste" className="mt-1" />
                  </div>
                  <div>
                    <Label>Gotra</Label>
                    <Input value={gotra} onChange={(e) => setGotra(e.target.value)} placeholder="Enter gotra" className="mt-1" />
                  </div>
                  <div>
                    <Label>Mother Tongue</Label>
                    <Input value={motherTongue} onChange={(e) => setMotherTongue(e.target.value)} placeholder="e.g. Hindi" className="mt-1" />
                  </div>
                  <div>
                    <Label>Marital Status *</Label>
                    <Select value={maritalStatus} onValueChange={setMaritalStatus}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{MARITAL_STATUSES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Manglik Status</Label>
                    <Select value={manglikStatus} onValueChange={setManglikStatus}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{MANGLIK_STATUSES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>State *</Label>
                    <Select value={state} onValueChange={setState}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Select state" /></SelectTrigger>
                      <SelectContent>{STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>District</Label>
                    <Input value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="Enter district" className="mt-1" />
                  </div>
                  <div>
                    <Label>City</Label>
                    <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter city" className="mt-1" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1"><ChevronLeft className="w-4 h-4 mr-1" />Back</Button>
                  <Button className="flex-1 btn-matrimonial" onClick={handleStep2Next}>Continue <ChevronRight className="w-4 h-4 ml-1" /></Button>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Qualification *</Label>
                    <Select value={qualification} onValueChange={setQualification}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{QUALIFICATIONS.map((q) => <SelectItem key={q} value={q}>{q}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Job Type</Label>
                    <Select value={jobType} onValueChange={setJobType}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{JOB_TYPES.map((j) => <SelectItem key={j} value={j}>{j}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Company / Organization</Label>
                    <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company name" className="mt-1" />
                  </div>
                  <div>
                    <Label>Position / Designation</Label>
                    <Input value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Your position" className="mt-1" />
                  </div>
                  <div>
                    <Label>Work Location</Label>
                    <Input value={workLocation} onChange={(e) => setWorkLocation(e.target.value)} placeholder="City of work" className="mt-1" />
                  </div>
                  <div>
                    <Label>Monthly Salary (₹)</Label>
                    <Input value={monthlySalary} onChange={(e) => setMonthlySalary(e.target.value)} placeholder="e.g. 50000" className="mt-1" />
                  </div>
                  <div>
                    <Label>Annual Income (₹)</Label>
                    <Input value={annualIncome} onChange={(e) => setAnnualIncome(e.target.value)} placeholder="e.g. 600000" className="mt-1" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1"><ChevronLeft className="w-4 h-4 mr-1" />Back</Button>
                  <Button className="flex-1 btn-matrimonial" onClick={handleStep3Next}>Continue <ChevronRight className="w-4 h-4 ml-1" /></Button>
                </div>
              </div>
            )}

            {/* Step 4 */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Father's Name</Label><Input value={fatherName} onChange={(e) => setFatherName(e.target.value)} placeholder="Father's full name" className="mt-1" /></div>
                  <div><Label>Father's Occupation</Label><Input value={fatherOccupation} onChange={(e) => setFatherOccupation(e.target.value)} placeholder="Occupation" className="mt-1" /></div>
                  <div><Label>Father's Income (₹/yr)</Label><Input value={fatherIncome} onChange={(e) => setFatherIncome(e.target.value)} placeholder="Annual income" className="mt-1" /></div>
                  <div><Label>Father's Phone</Label><Input value={fatherPhone} onChange={(e) => setFatherPhone(e.target.value)} placeholder="Phone number" className="mt-1" /></div>
                  <div><Label>Mother's Name</Label><Input value={motherName} onChange={(e) => setMotherName(e.target.value)} placeholder="Mother's full name" className="mt-1" /></div>
                  <div><Label>Mother's Occupation</Label><Input value={motherOccupation} onChange={(e) => setMotherOccupation(e.target.value)} placeholder="Occupation" className="mt-1" /></div>
                  <div><Label>Mother's Income (₹/yr)</Label><Input value={motherIncome} onChange={(e) => setMotherIncome(e.target.value)} placeholder="Annual income" className="mt-1" /></div>
                  <div><Label>Mother's Phone</Label><Input value={motherPhone} onChange={(e) => setMotherPhone(e.target.value)} placeholder="Phone number" className="mt-1" /></div>
                  <div>
                    <Label>Number of Brothers</Label>
                    <Select value={numberOfBrothers} onValueChange={setNumberOfBrothers}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>{["0","1","2","3","4","5+"].map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Number of Sisters</Label>
                    <Select value={numberOfSisters} onValueChange={setNumberOfSisters}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>{["0","1","2","3","4","5+"].map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Family Type *</Label>
                    <Select value={familyType} onValueChange={setFamilyType}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{FAMILY_TYPES.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Family Status</Label>
                    <Select value={familyStatus} onValueChange={setFamilyStatus}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{FAMILY_STATUSES.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(3)} className="flex-1"><ChevronLeft className="w-4 h-4 mr-1" />Back</Button>
                  <Button className="flex-1 btn-matrimonial" onClick={handleFinalSubmit} disabled={register.isPending}>
                    {register.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating Profile...</> : "Complete Registration"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
