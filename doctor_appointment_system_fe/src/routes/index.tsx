import { lazy, Suspense, type ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../context/authContext'
import PatientLayout from '../components/PatientLayout'
import DoctorLayout from '../components/DoctorLayout'
import AdminLayout from '../components/AdminLayout'


const Login = lazy(() => import('../pages/Login'))
const Register = lazy(() => import('../pages/Signup'))
const Landing = lazy(() => import('../pages/Landing'))
const Patientdashboard = lazy(() => import('../pages/PatientDashboard'))
const DoctorDashboard = lazy(() => import('../pages/DoctorDashboard'))
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'))
const DoctorAvailability = lazy(() => import('../pages/DoctorAvailability'))
const BookAppointment = lazy(() => import('../pages/BookAppointment'))
const MyAppointments = lazy(() => import('../pages/MyAppointments'))
const DoctorProfile = lazy(() => import('../pages/DoctorProfile'))
const DoctorAppintments = lazy(() => import('../pages/DoctorAppointments'))
const MyReviews = lazy(() => import('../pages/MyReviews'))

type RequireAuthType = { children: ReactNode, role?: string[] }

const RequireAuth = ({ children, role }: RequireAuthType) => {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-[#abc9d8] via-[#e8f1f5] to-white relative">
                {/* Ambient Top Glow to match login */}
                <div className="absolute top-0 left-0 right-0 h-44 bg-gradient-to-b from-[#8eb5ca]/20 to-transparent pointer-events-none" />

                {/* Spinner with soft blue/navy glow */}
                <div className="w-16 h-16 border-4 border-[#e3edf2] border-t-[#082e3e] rounded-full animate-spin shadow-[0_0_20px_rgba(142,181,202,0.3)]"></div>

                {/* Loading Text */}
                <p className="mt-4 text-[#082e3e]/80 text-sm font-bold tracking-wide animate-pulse">
                    Loading CliniQ...
                </p>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }


    if (role && !role.some((role) => user.role?.includes(role))) {

        return (
            <div className="fixed inset-0 z-50 min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center">

                <div className="bg-red-500/10 p-4 rounded-full mb-4">
                    <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>

                <h2 className="text-3xl font-bold mb-2">Access Denied</h2>
                <p className="text-slate-400">You do not have permission to view this page.</p>

            </div>
        )
    }

    return <>{children}</>
}

function index() {
    return (
        <BrowserRouter>
            <Suspense fallback={
                <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-[#abc9d8] via-[#e8f1f5] to-white relative">
                    {/* Ambient Top Glow */}
                    <div className="absolute top-0 left-0 right-0 h-44 bg-gradient-to-b from-[#8eb5ca]/20 to-transparent pointer-events-none" />

                    {/* Spinner with soft blue/navy glow */}
                    <div className="w-16 h-16 border-4 border-[#e3edf2] border-t-[#082e3e] rounded-full animate-spin shadow-[0_0_20px_rgba(142,181,202,0.3)]"></div>

                    {/* Loading Text */}
                    <p className="mt-4 text-[#082e3e]/80 text-sm font-bold tracking-wide animate-pulse">Loading CliniQ...</p>
                </div>
            }>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route element={<RequireAuth><PatientLayout /></RequireAuth>}>
                        <Route
                            path="/patient-dashboard"
                            element={
                                <RequireAuth role={['PATIENT']}>
                                    <Patientdashboard />
                                </RequireAuth>
                            }
                        />

                        <Route
                            path="/patient-book"
                            element={
                                <RequireAuth role={['PATIENT']}>
                                    <BookAppointment />
                                </RequireAuth>
                            }
                        />

                        <Route
                            path="/patient-appointments"
                            element={
                                <RequireAuth role={['PATIENT']}>
                                    <MyAppointments />
                                </RequireAuth>
                            }
                        />
        
                        
                    </Route>

                    <Route element={<RequireAuth><DoctorLayout /></RequireAuth>}>
                        <Route
                            path="/doctor-dashboard"
                            element={
                                <RequireAuth role={['DOCTOR']}>
                                    <DoctorDashboard />
                                </RequireAuth>
                            }
                        />

                        <Route
                            path="/doctor-availability"
                            element={
                                <RequireAuth role={['DOCTOR']}>
                                    <DoctorAvailability />
                                </RequireAuth>
                            }    
                        />

                        <Route
                            path="/doctor/profile"
                            element={
                                <RequireAuth role={['DOCTOR']}>
                                    <DoctorProfile />
                                </RequireAuth>
                            }
                        />

                        <Route
                            path="/doctor/appointments"
                            element={
                                <RequireAuth role={['DOCTOR']}>
                                    <DoctorAppintments />
                                </RequireAuth>
                            }
                        />

                        <Route
                            path="/doctor/reviews"
                            element={
                                <RequireAuth role={['DOCTOR']}>
                                    <MyReviews />
                                </RequireAuth>
                            }
                        />

                    </Route>

                    <Route element={<RequireAuth><AdminLayout /></RequireAuth>}>
                        <Route
                            path="/admin-dashboard"
                            element={
                                <RequireAuth role={['ADMIN']}>
                                    <AdminDashboard />
                                </RequireAuth>
                            }
                        />
                    </Route>

                </Routes>
            </Suspense>
        </BrowserRouter>
    )
}

export default index