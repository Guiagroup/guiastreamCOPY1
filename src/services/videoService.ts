import { Video } from "../types/video";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const getVideos = async (): Promise<Video[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('user_id', user.id)
    .order('upload_date', { ascending: false });

  if (error) {
    console.error('Error fetching videos:', error);
    return [];
  }

  return data || [];
};

export const addVideo = async (video: Omit<Video, 'id' | 'user_id'>): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  // First, check if the user has reached their upload limit
  const { data: profile } = await supabase
    .from('profiles')
    .select('uploads_used, monthly_upload_limit')
    .eq('id', user.id)
    .single();

  if (!profile) {
    toast.error("Failed to fetch user profile");
    return false;
  }

  if (profile.uploads_used >= profile.monthly_upload_limit) {
    toast.error("Monthly upload limit reached", {
      description: "Please upgrade your plan to upload more videos"
    });
    return false;
  }

  // Insert the video
  const { error: videoError } = await supabase
    .from('videos')
    .insert([{ 
      ...video, 
      user_id: user.id,
      last_played_position: 0
    }]);

  if (videoError) {
    console.error('Error adding video:', videoError);
    return false;
  }

  // Update the uploads count
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ uploads_used: profile.uploads_used + 1 })
    .eq('id', user.id);

  if (updateError) {
    console.error('Error updating upload count:', updateError);
    // The video was added but we couldn't update the count
    toast.error("Failed to update upload count");
    return true;
  }

  return true;
};

export const getVideoById = async (id: string): Promise<Video | null> => {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching video:', error);
    return null;
  }

  return data;
};

export const getLatestVideo = async (): Promise<Video | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('user_id', user.id)
    .order('upload_date', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching latest video:', error);
    return null;
  }

  return data;
};

export const updateVideo = async (updatedVideo: Video): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from('videos')
    .update({
      title: updatedVideo.title,
      description: updatedVideo.description,
      video_url: updatedVideo.video_url,
      thumbnail_url: updatedVideo.thumbnail_url,
      category: updatedVideo.category,
      is_favorite: updatedVideo.is_favorite,
      last_played_position: updatedVideo.last_played_position
    })
    .eq('id', updatedVideo.id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error updating video:', error);
    return false;
  }

  return true;
};

export const deleteVideo = async (videoId: string): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from('videos')
    .delete()
    .eq('id', videoId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting video:', error);
    return false;
  }

  return true;
};

export const searchVideos = async (query: string): Promise<Video[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const searchTerm = query.toLowerCase();
  
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('user_id', user.id)
    .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`);

  if (error) {
    console.error('Error searching videos:', error);
    return [];
  }

  return data || [];
};