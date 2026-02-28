import { useState } from 'react';
import { useGetAllProfiles, useUpdateProfileStatus, useGetAllPhotos } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, Ban, Plus, Search, Phone, Loader2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { saveProfile, getAllProfiles } from '../../lib/localStorage';
import type { UserProfile } from '../../lib/localStorage';

const STATUS_COLORS: Record<UserProfile['status'], string> = {
  approved: 'bg-green-100 text-green-700 border-green-300',
  pending: 'bg-amber-100 text-amber-700 border-amber-300',
  rejected: 'bg-red-100 text-red-700 border-red-300',
  suspended: 'bg-gray-100 text-gray-700 border-gray-300',
};

function AddCandidateModal({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
  const [isPending, setIsPending] = useState(false);
  const [form, setForm] = useState({
    fullName: '', phone: '', email: '', gender: 'male',
    dateOfBirth: '', religion: '', caste: '', state: '', city: '',
    qualification: '', jobType: 'Private', monthlySalary: '', annualIncome: '',
    familyType: 'Nuclear', familyStatus: 'Middle Class',
  });

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async () => {
    if (!form.fullName || !form.phone) { toast.error('Name and phone are required'); return; }
    setIsPending(true);
    try {
      const newProfile: UserProfile = {
        id: Math.random().toString(36).slice(2) + Date.now().toString(36),
        fullName: form.fullName,
        phone: form.phone,
        email: form.email || undefined,
        gender: form.gender,
        dateOfBirth: form.dateOfBirth,
        age: form.dateOfBirth ? new Date().getFullYear() - new Date(form.dateOfBirth).getFullYear() : 0,
        height: '',
        weight: '',
        religion: form.religion,
        caste: form.caste,
        subCaste: '',
        gotra: '',
        motherTongue: '',
        maritalStatus: 'Never Married',
        state: form.state,
        district: '',
        city: form.city,
        manglikStatus: '',
        isPhoneVerified: true,
        qualification: form.qualification,
        jobType: form.jobType,
        company: '',
        position: '',
        workLocation: '',
        monthlySalary: form.monthlySalary,
        annualIncome: form.annualIncome,
        fatherName: '',
        fatherOccupation: '',
        fatherIncome: '',
        fatherPhone: '',
        motherName: '',
        motherOccupation: '',
        motherIncome: '',
        motherPhone: '',
        numberOfBrothers: 0,
        numberOfSisters: 0,
        familyType: form.familyType,
        familyStatus: form.familyStatus,
        photoCount: 4, // Admin-added candidates are visible by default
        isVisible: true,
        role: 'user',
        status: 'approved',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      saveProfile(newProfile);
      toast.success('Candidate added successfully!');
      onAdded();
      onClose();
    } catch {
      toast.error('Failed to add candidate');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Full Name *', key: 'fullName', type: 'text' },
          { label: 'Phone *', key: 'phone', type: 'tel' },
          { label: 'Email', key: 'email', type: 'email' },
          { label: 'Date of Birth', key: 'dateOfBirth', type: 'date' },
          { label: 'Religion', key: 'religion', type: 'text' },
          { label: 'Caste', key: 'caste', type: 'text' },
          { label: 'State', key: 'state', type: 'text' },
          { label: 'City', key: 'city', type: 'text' },
          { label: 'Qualification', key: 'qualification', type: 'text' },
          { label: 'Monthly Salary', key: 'monthlySalary', type: 'number' },
          { label: 'Annual Income', key: 'annualIncome', type: 'number' },
        ].map(({ label, key, type }) => (
          <div key={key} className="space-y-1">
            <Label className="text-xs">{label}</Label>
            <Input
              type={type}
              value={(form as Record<string, string>)[key] ?? ''}
              onChange={(e) => set(key, e.target.value)}
              className="text-sm"
            />
          </div>
        ))}
        <div className="space-y-1">
          <Label className="text-xs">Gender</Label>
          <Select value={form.gender} onValueChange={(v) => set('gender', v)}>
            <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Job Type</Label>
          <Select value={form.jobType} onValueChange={(v) => set('jobType', v)}>
            <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {['Government', 'Private', 'Business', 'Self Employed', 'Not Working', 'Other'].map((j) => (
                <SelectItem key={j} value={j}>{j}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button
        className="w-full btn-matrimonial gap-2"
        onClick={handleSubmit}
        disabled={isPending}
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
        Add Candidate
      </Button>
    </div>
  );
}

export default function CandidatesManagement() {
  const { data: profiles = [], isLoading, refetch } = useGetAllProfiles();
  const { data: allPhotos = [] } = useGetAllPhotos();
  const updateStatus = useUpdateProfileStatus();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAdd, setShowAdd] = useState(false);
  const [viewProfile, setViewProfile] = useState<UserProfile | null>(null);

  const filtered = profiles.filter((p) => {
    const matchSearch =
      p.fullName.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search) ||
      (p.email || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleStatus = async (id: string, status: UserProfile['status']) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success(`Profile ${status}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const getPhotoCount = (profileId: string) => allPhotos.filter((p) => p.userId === profileId).length;
  const getPhotos = (profileId: string) => allPhotos.filter((p) => p.userId === profileId);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-sm"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="btn-matrimonial gap-2" onClick={() => setShowAdd(true)}>
          <Plus className="w-4 h-4" /> Add Candidate
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total', count: profiles.length, color: 'text-foreground' },
          { label: 'Pending', count: profiles.filter((p) => p.status === 'pending').length, color: 'text-amber-600' },
          { label: 'Approved', count: profiles.filter((p) => p.status === 'approved').length, color: 'text-green-600' },
          { label: 'Suspended', count: profiles.filter((p) => p.status === 'suspended').length, color: 'text-red-600' },
        ].map((s) => (
          <Card key={s.label} className="card-matrimonial">
            <CardContent className="p-3 text-center">
              <p className={`font-serif text-2xl font-bold ${s.color}`}>{s.count}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card className="card-matrimonial">
        <CardHeader>
          <CardTitle className="font-serif text-base">Candidates ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Name</TableHead>
                    <TableHead className="text-xs">Phone</TableHead>
                    <TableHead className="text-xs">Religion/Caste</TableHead>
                    <TableHead className="text-xs">Location</TableHead>
                    <TableHead className="text-xs">Photos</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((profile) => {
                    const photoCount = getPhotoCount(profile.id);
                    return (
                      <TableRow key={profile.id}>
                        <TableCell>
                          <div>
                            <p className="font-serif text-sm font-semibold">{profile.fullName}</p>
                            <p className="text-xs text-muted-foreground">{profile.email || '—'}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="w-3 h-3 text-primary" />
                            {profile.phone}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs">
                          {profile.religion || '—'} / {profile.caste || '—'}
                        </TableCell>
                        <TableCell className="text-xs">
                          {profile.city || '—'}, {profile.state || '—'}
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            photoCount >= 4
                              ? 'bg-green-100 text-green-700 border-green-300 text-xs'
                              : 'bg-red-100 text-red-700 border-red-300 text-xs'
                          }>
                            {photoCount}/4
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${STATUS_COLORS[profile.status]} text-xs`}>
                            {profile.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="w-7 h-7"
                              onClick={() => setViewProfile(profile)}
                              title="View"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Button>
                            {profile.status !== 'approved' && (
                              <Button
                                size="icon"
                                variant="ghost"
                                className="w-7 h-7 text-green-600 hover:text-green-700"
                                onClick={() => handleStatus(profile.id, 'approved')}
                                title="Approve"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                              </Button>
                            )}
                            {profile.status !== 'rejected' && (
                              <Button
                                size="icon"
                                variant="ghost"
                                className="w-7 h-7 text-red-600 hover:text-red-700"
                                onClick={() => handleStatus(profile.id, 'rejected')}
                                title="Reject"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </Button>
                            )}
                            {profile.status !== 'suspended' && (
                              <Button
                                size="icon"
                                variant="ghost"
                                className="w-7 h-7 text-gray-600 hover:text-gray-700"
                                onClick={() => handleStatus(profile.id, 'suspended')}
                                title="Suspend"
                              >
                                <Ban className="w-3.5 h-3.5" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Candidate Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Add Candidate Manually</DialogTitle>
          </DialogHeader>
          <AddCandidateModal onClose={() => setShowAdd(false)} onAdded={() => refetch()} />
        </DialogContent>
      </Dialog>

      {/* View Profile Dialog */}
      <Dialog open={!!viewProfile} onOpenChange={() => setViewProfile(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">{viewProfile?.fullName}</DialogTitle>
          </DialogHeader>
          {viewProfile && (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-2 text-sm">
                {([
                  ['Phone', viewProfile.phone],
                  ['Email', viewProfile.email || '—'],
                  ['Gender', viewProfile.gender],
                  ['DOB', viewProfile.dateOfBirth],
                  ['Age', String(viewProfile.age || '—')],
                  ['Religion', viewProfile.religion],
                  ['Caste', viewProfile.caste],
                  ['State', viewProfile.state],
                  ['City', viewProfile.city],
                  ['Qualification', viewProfile.qualification],
                  ['Job Type', viewProfile.jobType],
                  ['Monthly Salary', viewProfile.monthlySalary ? `₹${viewProfile.monthlySalary}` : '—'],
                  ['Annual Income', viewProfile.annualIncome ? `₹${viewProfile.annualIncome}` : '—'],
                  ['Father', viewProfile.fatherName],
                  ['Mother', viewProfile.motherName],
                  ['Family Type', viewProfile.familyType],
                ] as [string, string][]).map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm font-medium">{value || '—'}</p>
                  </div>
                ))}
              </div>
              {/* Photos from photo store */}
              {getPhotos(viewProfile.id).length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Photos ({getPhotos(viewProfile.id).length})</p>
                  <div className="grid grid-cols-4 gap-2">
                    {getPhotos(viewProfile.id).map((photo) => (
                      <img
                        key={photo.id}
                        src={photo.url}
                        alt="Profile photo"
                        className="aspect-square rounded-lg object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
