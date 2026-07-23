import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Loader2, AlertCircle, Sparkles, User, Award } from 'lucide-react';
import { useAuth } from '../context/authContext';
import { getDoctorOwnReviews } from '../services/review'; 
import type { ReviewResponseDTO } from '../types/types';

const MyReviews = () => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState<ReviewResponseDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            setIsLoading(true);
            try {
                const data = await getDoctorOwnReviews(user.id);
                setReviews(data);
            } catch (err) {
                console.error("Failed to load doctor reviews", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchReviews();
    }, [user.id]);

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    const getRatingCount = (stars: number) => reviews.filter(r => r.rating === stars).length;
    const getRatingPercentage = (stars: number) => {
        if (totalReviews === 0) return 0;
        return (getRatingCount(stars) / totalReviews) * 100;
    };

    const renderStars = (rating: number, size = "w-5 h-5") => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<Star key={i} className={`${size} text-amber-400 fill-current shrink-0`} />);
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(<Star key={i} className={`${size} text-amber-400 fill-current opacity-50 shrink-0`} />);
            } else {
                stars.push(<Star key={i} className={`${size} text-slate-200 shrink-0`} />);
            }
        }
        return stars;
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Top Banner */}
            <div className="bg-gradient-to-br from-[#8eb5ca] via-[#709eb7] to-[#082e3e] rounded-[2.5rem] border border-white p-8 md:p-10 relative overflow-hidden text-white shadow-lg">
                <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 text-left">
                    <div className="inline-flex items-center space-x-1 bg-white/15 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md mb-4 border border-white/10">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Outpatient Feedback Hub</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Patient Ratings & Reviews</h2>
                    <p className="text-slate-100 text-sm mt-3 leading-relaxed max-w-xl font-medium">
                        Monitor live reviews and ratings submitted by completed consultation outpatients. Evaluate your clinical performance indexes.
                    </p>
                </div>
            </div>

            {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-[#082e3e] animate-spin" />
                </div>
            ) : reviews.length > 0 ? (
                /* Split Grid Layout (Metrics on Left, Comments list on Right) */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    
                    {/* Left Column: Summary Metrics (1 column) */}
                    <div className="lg:col-span-1 bg-white border border-slate-200/50 rounded-[2.25rem] p-6 shadow-xs space-y-6 text-left">
                        {/* Rating Card */}
                        <div className="bg-[#f8fafc] border border-slate-200/40 p-5 rounded-[1.75rem] text-center space-y-2">
                            <span className="text-[10px] font-black uppercase text-slate-400 block">Total Rating Summary</span>
                            <span className="text-3xl font-black text-[#082e3e] block">{averageRating.toFixed(1)} / 5.0</span>
                            <div className="flex justify-center gap-1">
                                {renderStars(averageRating, "w-6 h-6")}
                            </div>
                            <span className="text-[10px] text-slate-400 font-bold block uppercase mt-1">Based on {totalReviews} Reviews</span>
                        </div>

                        {/* Progress Bars (1-5 Star breakdown) */}
                        <div className="space-y-3.5">
                            <span className="block text-[10px] font-black uppercase text-[#85abc0] tracking-wider">Rating Breakdown</span>
                            {[5, 4, 3, 2, 1].map((stars) => (
                                <div key={stars} className="flex items-center gap-3 text-xs font-bold">
                                    <span className="w-12 text-slate-400">{stars} Stars</span>
                                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-amber-400 rounded-full" 
                                            style={{ width: `${getRatingPercentage(stars)}%` }} 
                                        />
                                    </div>
                                    <span className="w-8 text-right text-slate-600">{getRatingCount(stars)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Scrollable Reviews List (2 columns) */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xs font-black text-[#082e3e] uppercase tracking-widest">Patient Feedback Feed</h3>
                        </div>

                        <div className="space-y-4 max-h-[35rem] overflow-y-auto pr-1">
                            {reviews.map((rev) => (
                                <div key={rev.id} className="bg-white border border-slate-200/50 p-6 rounded-[1.75rem] shadow-xs space-y-4 text-left">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 bg-[#f0f5f8] text-[#0a4053] rounded-xl border border-white shadow-3xs shrink-0">
                                                <User className="w-4.5 h-4.5" />
                                            </div>
                                            <div>
                                                <span className="font-extrabold text-sm text-[#082e3e] block">{rev.patientName}</span>
                                                <span className="text-[10px] font-bold text-slate-400 block mt-0.5">{rev.createdAt}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            {renderStars(rev.rating, "w-4 h-4")}
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 leading-relaxed font-semibold italic bg-[#f8fafc] p-4 rounded-2xl border border-slate-200/10">
                                        "{rev.comment || "No written feedback provided."}"
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            ) : (
                /* Empty Placeholder */
                <div className="bg-white/40 border border-slate-200/50 border-dashed rounded-[2.5rem] p-16 text-center">
                    <div className="p-4 bg-[#e3edf2] text-[#0a4053] rounded-full inline-block border border-white mb-4">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <h4 className="text-base font-black text-[#082e3e] uppercase tracking-wider">No Reviews Yet</h4>
                    <p className="text-slate-400 text-xs font-bold leading-relaxed max-w-sm mx-auto mt-2">
                        You have not received any patient ratings or reviews yet. Reviews will automatically populate here after completed consultation sessions.
                    </p>
                </div>
            )}
        </div>
    );
};

export default MyReviews;