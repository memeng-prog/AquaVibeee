import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { MOCK_PRODUCTS } from '@/data/products';
import { getSupabase } from '@/lib/supabase';
import type { Product } from '@/types';
import { useEffect, useState } from 'react';

interface ProductFormProps {
  productToEdit: Product | null;
  onFormSubmit: () => void;
}

export function ProductForm({ productToEdit, onFormSubmit }: ProductFormProps) {
  const [product, setProduct] = useState<Partial<Product>>(
    productToEdit || {
      name: '',
      description: '',
      price: 0,
      category: 'accessories',
      imageUrl: '',
    }
  );

  useEffect(() => {
    setProduct(
      productToEdit || {
        name: '',
        description: '',
        price: 0,
        category: 'accessories',
        imageUrl: '',
      },
    )
  }, [productToEdit])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const supabase = getSupabase()
    let savedToDb = false

    if (supabase) {
      const payload = {
        name: product.name || '',
        description: product.description || '',
        long_description: product.description || '',
        price: Number(product.price || 0),
        category: product.category || 'accessories',
        image_url: product.imageUrl || '',
      }

      if (productToEdit) {
        const { error } = await supabase.from('products').update(payload as never).eq('id', productToEdit.id)
        if (!error) savedToDb = true
      } else {
        const { error } = await supabase.from('products').insert(payload as never)
        if (!error) savedToDb = true
      }
    }

    if (!savedToDb) {
      if (productToEdit) {
        const index = MOCK_PRODUCTS.findIndex((item) => item.id === productToEdit.id)
        if (index !== -1) {
          MOCK_PRODUCTS[index] = {
            ...MOCK_PRODUCTS[index],
            name: product.name || MOCK_PRODUCTS[index].name,
            description: product.description || MOCK_PRODUCTS[index].description,
            longDescription: product.description || MOCK_PRODUCTS[index].longDescription,
            price: Number(product.price || 0),
            imageUrl: product.imageUrl || MOCK_PRODUCTS[index].imageUrl,
          }
          console.log('Updating product (local fallback):', MOCK_PRODUCTS[index]);
        }
      } else {
        // Local fallback if DB is not available
        const newProduct = {
          ...product,
          id: Date.now().toString(),
          slug: product.name?.toLowerCase().replace(/\s+/g, '-') || '',
        } as Product;
        MOCK_PRODUCTS.push(newProduct);
        console.log('Adding product (local fallback):', newProduct);
      }
    }

    onFormSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4 bg-white p-6 rounded-lg shadow-soft">
      <Input
        label="Product Name"
        name="name"
        value={product.name || ''}
        onChange={handleChange}
        required
      />
      <Textarea
        label="Description"
        name="description"
        value={product.description || ''}
        onChange={handleChange}
        required
      />
      <Input
        label="Price"
        name="price"
        type="number"
        step="0.01"
        value={product.price || 0}
        onChange={handleChange}
        required
      />
      <Input
        label="Image URL"
        name="imageUrl"
        value={product.imageUrl || ''}
        onChange={handleChange}
        required
      />
      <Button type="submit">{productToEdit ? 'Update Product' : 'Add Product'}</Button>
    </form>
  );
}
