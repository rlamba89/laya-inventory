export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          slug: string;
          name: string;
          tagline: string | null;
          location: string | null;
          description: string | null;
          branding: Json;
          siteplan_image_url: string | null;
          siteplan_width: number | null;
          siteplan_height: number | null;
          unit_label: string;
          unit_label_short: string;
          currency_code: string;
          currency_symbol: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          tagline?: string | null;
          location?: string | null;
          description?: string | null;
          branding?: Json;
          siteplan_image_url?: string | null;
          siteplan_width?: number | null;
          siteplan_height?: number | null;
          unit_label?: string;
          unit_label_short?: string;
          currency_code?: string;
          currency_symbol?: string;
          is_active?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
      };
      group_types: {
        Row: {
          id: string;
          project_id: string;
          name: string;
          slug: string;
          display_order: number;
          is_filterable: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          name: string;
          slug: string;
          display_order: number;
          is_filterable?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["group_types"]["Insert"]>;
      };
      groups: {
        Row: {
          id: string;
          project_id: string;
          group_type_id: string;
          parent_id: string | null;
          name: string;
          short_name: string | null;
          sort_order: number;
          release_status: string;
          visible_to_clients: boolean;
          release_date: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          group_type_id: string;
          parent_id?: string | null;
          name: string;
          short_name?: string | null;
          sort_order?: number;
          release_status?: string;
          visible_to_clients?: boolean;
          release_date?: string | null;
          metadata?: Json;
        };
        Update: Partial<Database["public"]["Tables"]["groups"]["Insert"]>;
      };
      unit_types: {
        Row: {
          id: string;
          project_id: string;
          code: string;
          name: string | null;
          beds: number | null;
          baths: number | null;
          cars: number | null;
          description: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          code: string;
          name?: string | null;
          beds?: number | null;
          baths?: number | null;
          cars?: number | null;
          description?: string | null;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["unit_types"]["Insert"]>;
      };
      units: {
        Row: {
          id: string;
          project_id: string;
          unit_number: number;
          unit_type_id: string | null;
          label: string;
          beds: number;
          baths: number;
          cars: number;
          ground_internal: number | null;
          ground_garage: number | null;
          upper_internal: number | null;
          upper_balcony: number | null;
          patio: number | null;
          total_area: number | null;
          front_yard: number | null;
          back_yard: number | null;
          lot_size: number | null;
          custom_fields: Json;
          status: string;
          hotspot_x: number | null;
          hotspot_y: number | null;
          notes: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          unit_number: number;
          unit_type_id?: string | null;
          label: string;
          beds: number;
          baths: number;
          cars?: number;
          ground_internal?: number | null;
          ground_garage?: number | null;
          upper_internal?: number | null;
          upper_balcony?: number | null;
          patio?: number | null;
          total_area?: number | null;
          front_yard?: number | null;
          back_yard?: number | null;
          lot_size?: number | null;
          custom_fields?: Json;
          status?: string;
          hotspot_x?: number | null;
          hotspot_y?: number | null;
          notes?: string | null;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["units"]["Insert"]>;
      };
      unit_groups: {
        Row: {
          unit_id: string;
          group_id: string;
        };
        Insert: {
          unit_id: string;
          group_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["unit_groups"]["Insert"]>;
      };
      unit_prices: {
        Row: {
          id: string;
          unit_id: string;
          price_type: string;
          price_min: number;
          price_max: number;
          display_text: string | null;
          is_current: boolean;
          effective_from: string;
          effective_to: string | null;
          changed_by: string | null;
          change_reason: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          unit_id: string;
          price_type?: string;
          price_min: number;
          price_max: number;
          display_text?: string | null;
          is_current?: boolean;
          effective_from?: string;
          effective_to?: string | null;
          changed_by?: string | null;
          change_reason?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["unit_prices"]["Insert"]>;
      };
      media: {
        Row: {
          id: string;
          project_id: string;
          unit_id: string | null;
          unit_type_id: string | null;
          media_type: string;
          variant: string | null;
          url: string;
          alt_text: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          unit_id?: string | null;
          unit_type_id?: string | null;
          media_type: string;
          variant?: string | null;
          url: string;
          alt_text?: string | null;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["media"]["Insert"]>;
      };
      project_amenities: {
        Row: {
          id: string;
          project_id: string;
          name: string;
          description: string | null;
          icon: string | null;
          category: string | null;
          image_url: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          name: string;
          description?: string | null;
          icon?: string | null;
          category?: string | null;
          image_url?: string | null;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["project_amenities"]["Insert"]>;
      };
      status_audit_log: {
        Row: {
          id: string;
          unit_id: string;
          old_status: string | null;
          new_status: string;
          changed_by: string | null;
          changed_at: string;
          notes: string | null;
        };
        Insert: {
          id?: string;
          unit_id: string;
          old_status?: string | null;
          new_status: string;
          changed_by?: string | null;
          notes?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["status_audit_log"]["Insert"]>;
      };
      price_visibility: {
        Row: {
          id: string;
          project_id: string;
          view_mode: string;
          show_prices: boolean;
          show_price_range: boolean;
          price_type_shown: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          view_mode: string;
          show_prices?: boolean;
          show_price_range?: boolean;
          price_type_shown?: string;
        };
        Update: Partial<Database["public"]["Tables"]["price_visibility"]["Insert"]>;
      };
    };
  };
}
