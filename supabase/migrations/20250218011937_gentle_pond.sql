/*
  # Create cart items table

  1. New Tables
    - `cart_items`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `shoe_id` (text)
      - `size` (text)
      - `quantity` (integer)
      - `region` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `cart_items` table
    - Add policies for users to manage their own cart items
*/

CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  shoe_id text NOT NULL,
  size text NOT NULL,
  quantity integer NOT NULL,
  region text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own cart items"
  ON cart_items
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);