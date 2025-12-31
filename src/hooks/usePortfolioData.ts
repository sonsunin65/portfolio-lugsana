import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useProfile = () => {
    return useQuery({
        queryKey: ["profile"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .limit(1)
                .single();

            if (error) throw error;
            return data;
        },
    });
};

export const useHighlights = () => {
    return useQuery({
        queryKey: ["highlights"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("highlights")
                .select("*")
                .order("display_order", { ascending: true });

            if (error) throw error;
            return data;
        },
    });
};

export const useWorks = () => {
    return useQuery({
        queryKey: ["works"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("works")
                .select("*")
                .order("display_order", { ascending: true });

            if (error) throw error;
            return data;
        },
    });
};

export const useActivities = () => {
    return useQuery({
        queryKey: ["activities"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("activities")
                .select("*")
                .order("display_order", { ascending: true });

            if (error) throw error;
            return data;
        },
    });
};

export const useCertificates = () => {
    return useQuery({
        queryKey: ["certificates"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("certificates")
                .select("*")
                .order("display_order", { ascending: true });

            if (error) throw error;
            return data;
        },
    });
};

export const useStats = () => {
    return useQuery({
        queryKey: ["stats"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("stats")
                .select("*")
                .order("display_order", { ascending: true });

            if (error) throw error;
            return data;
        },
    });
};
