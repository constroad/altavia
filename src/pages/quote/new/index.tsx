import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAsync } from 'src/common/hooks';
import { toast } from 'src/components';
import axios from 'axios';
import { API_ROUTES, APP_ROUTES } from 'src/common/consts';
import { Button } from '@chakra-ui/react';
import { quoteValidationSchema } from 'src/models/quote';

type IQuote = {
  client: string;
  description: string;
  quantity: number;
  price: number;
  total: number;
};

const postQuote = (path: string, data: IQuote) => axios.post(path, data);

const NewQuote: React.FC = () => {
  const [client, setClient] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const { run, isLoading } = useAsync({ onSuccess: successNewQuote });

  const router = useRouter();

  // handlers
  function successNewQuote() {
    toast.success('Cotizacion creada!');
    router.push(APP_ROUTES.quote);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newQuote = {
      client,
      description,
      quantity: parseFloat(quantity),
      price: parseFloat(price),
      total: parseFloat(quantity) * parseFloat(price),
    };
    const result = quoteValidationSchema.safeParse(newQuote);

    if (!result.success) {
      toast.warning("Revise los parametros obligatorios")
      return
    }

    run(postQuote(API_ROUTES.quote, newQuote), {
      onError: (error) => {
        toast.error("Algo salio mal, contacte al administrador")
      },
    });
  };

  return (
    <div>
      <h1>Nueva Cotización</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Cliente:
          <input
            required
            type="text"
            value={client}
            onChange={(e) => setClient(e.target.value)}
          />
        </label>
        <br />
        <label>
          Descripción:
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <br />
        <label>
          Cantidad:
          <input
            required
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </label>
        <br />
        <label>
          Precio Unitario:
          <input
            required
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </label>
        <br />
        <Button isLoading={isLoading} type="submit">Crear Cotización</Button>
      </form>
    </div>
  );
};

export default NewQuote;
