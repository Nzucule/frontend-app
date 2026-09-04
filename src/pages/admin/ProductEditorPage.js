import {
  useEffect,
  useState,
} from 'react';

import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom';

import SidebarAdmin from '../../components/SidebarAdmin';
import HeaderAdmin from '../../components/HeaderAdmin';
import Button from '../../components/Button';
import { useStore } from '../../context/StoreContext';
import { categories } from '../../data/defaultData';
import { createProductPlaceholder } from '../../utils/imagePlaceholder';
import '../../styles/DashboardAdmin.css';
import '../../styles/admin/produtos.css';


const blankProduct = {
  name: '',
  category: 'Repelentes',
  price: '',
  oldPrice: '',
  stock: '',
  description: '',
  featuresText: '',
  image: '',
  featured: false,
  active: true,
  notifyCustomers: true,
};


/*
 * Optimização automática das fotografias.
 *
 * - Redimensiona
 * - Converte para WEBP
 * - Reduz o peso
 *
 * Isso evita enviar fotografias enormes
 * para a API/base de dados.
 */
function optimizeProductImage(
  file,
  {
    maxWidth = 1000,
    maxHeight = 750,
    quality = 0.82,
  } = {},
) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => {
      reject(
        new Error(
          'Não foi possível ler a imagem seleccionada.',
        ),
      );
    };

    reader.onload = () => {
      const image = new Image();

      image.onerror = () => {
        reject(
          new Error(
            'Não foi possível processar a imagem.',
          ),
        );
      };

      image.onload = () => {
        let width = image.width;
        let height = image.height;

        /*
         * Mantém a proporção da fotografia.
         */
        const scale = Math.min(
          maxWidth / width,
          maxHeight / height,
          1,
        );

        width = Math.round(width * scale);
        height = Math.round(height * scale);

        const canvas = document.createElement('canvas');

        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext('2d', {
          alpha: false,
        });

        if (!context) {
          reject(
            new Error(
              'Não foi possível preparar a imagem.',
            ),
          );

          return;
        }

        /*
         * Fundo branco.
         *
         * Evita problemas ao converter PNG
         * transparente para WEBP/JPEG.
         */
        context.fillStyle = '#FFFFFF';

        context.fillRect(
          0,
          0,
          width,
          height,
        );

        /*
         * Melhora a qualidade do redimensionamento.
         */
        context.imageSmoothingEnabled = true;

        context.imageSmoothingQuality = 'high';

        context.drawImage(
          image,
          0,
          0,
          width,
          height,
        );

        /*
         * WEBP reduz muito o peso mantendo
         * boa qualidade visual.
         */
        const optimizedDataUrl =
          canvas.toDataURL(
            'image/webp',
            quality,
          );

        resolve(optimizedDataUrl);
      };

      image.src = reader.result;
    };

    reader.readAsDataURL(file);
  });
}


export default function ProductEditorPage() {
  const { productId } = useParams();

  const {
    products = [],
    saveProduct,
  } = useStore();

  const navigate = useNavigate();

  /*
   * IMPORTANTE:
   * IDs vindos da API podem ser números,
   * enquanto useParams devolve string.
   */
  const existing = products.find(
    (product) =>
      String(product.id) === String(productId),
  );

  const [form, setForm] = useState(blankProduct);

  const [error, setError] = useState('');

  const [imageError, setImageError] =
    useState('');

  const [processingImage, setProcessingImage] =
    useState(false);

  const [saving, setSaving] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  useEffect(() => {
    if (!existing) {
      return;
    }

    setForm({
      ...existing,

      price:
        existing.price !== undefined
          ? String(existing.price)
          : '',

      oldPrice:
        Number(existing.oldPrice || 0) > 0
          ? String(existing.oldPrice)
          : '',

      stock:
        existing.stock !== undefined
          ? String(existing.stock)
          : '',

      featuresText:
        Array.isArray(existing.features)
          ? existing.features.join('\n')
          : '',
    });
  }, [existing]);


  function update(event) {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((current) => ({
      ...current,

      [name]:
        type === 'checkbox'
          ? checked
          : value,
    }));

    setError('');
  }


  /*
   * SELECÇÃO E COMPRESSÃO DA IMAGEM
   */
  async function handleImage(event) {
    const file =
      event.target.files?.[0];

    setImageError('');

    if (!file) {
      return;
    }


    if (!file.type.startsWith('image/')) {
      setImageError(
        'Seleccione um ficheiro de imagem válido.',
      );

      event.target.value = '';

      return;
    }


    /*
     * Aceitamos ficheiros maiores porque serão
     * comprimidos antes de serem enviados.
     *
     * Ainda colocamos um limite de segurança.
     */
    const maxOriginalSize =
      8 * 1024 * 1024;

    if (file.size > maxOriginalSize) {
      setImageError(
        'A fotografia original deve ter no máximo 8 MB.',
      );

      event.target.value = '';

      return;
    }


    setProcessingImage(true);

    try {
      const optimizedImage =
        await optimizeProductImage(
          file,
          {
            maxWidth: 1000,
            maxHeight: 750,
            quality: 0.82,
          },
        );

      setForm((current) => ({
        ...current,
        image: optimizedImage,
      }));
    } catch (err) {
      setImageError(
        err.message ||
          'Não foi possível optimizar a imagem.',
      );
    } finally {
      setProcessingImage(false);

      /*
       * Permite seleccionar novamente
       * o mesmo ficheiro posteriormente.
       */
      event.target.value = '';
    }
  }


  async function submit(event) {
    event.preventDefault();

    if (
      saving ||
      processingImage
    ) {
      return;
    }

    setError('');


    const name =
      form.name.trim();

    const description =
      form.description.trim();

    const price =
      Number(form.price);

    const oldPrice =
      Number(form.oldPrice) || 0;

    const stock =
      Number(form.stock);


    if (!name || !description) {
      setError(
        'Preencha o nome e a descrição do artigo.',
      );

      return;
    }


    if (
      !Number.isFinite(price) ||
      price <= 0
    ) {
      setError(
        'Informe um preço válido.',
      );

      return;
    }


    if (
      !Number.isFinite(stock) ||
      stock < 0
    ) {
      setError(
        'O stock deve ser igual ou superior a zero.',
      );

      return;
    }


    if (
      oldPrice > 0 &&
      oldPrice < price
    ) {
      setError(
        'O preço anterior deve ser superior ao preço actual.',
      );

      return;
    }


    const features = form.featuresText
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);


    setSaving(true);

    try {
      await saveProduct({
        id: existing?.id,

        name,

        category: form.category,

        price,

        oldPrice,

        stock,

        description,

        features,

        image:
          form.image || null,

        featured:
          Boolean(form.featured),

        active:
          Boolean(form.active),

        notifyCustomers:
          Boolean(form.notifyCustomers),
      });


      navigate(
        '/admin/produtos',
      );
    } catch (err) {
      setError(
        err.message ||
          'Não foi possível guardar o artigo.',
      );
    } finally {
      setSaving(false);
    }
  }


  /*
   * Só apresenta produto não encontrado
   * quando efectivamente estamos a editar
   * um ID que não existe.
   */
  if (
    productId &&
    products.length > 0 &&
    !existing
  ) {
    return (
      <div className="dashboard">
        <SidebarAdmin
          mobileOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        <div className="main-content">
          <HeaderAdmin
            onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          />

          <div className="admin-card">

            <h1>
              Artigo não encontrado
            </h1>

            <Link to="/admin/produtos">
              Voltar aos artigos
            </Link>

          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="dashboard">
      <SidebarAdmin
        mobileOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <div className="main-content">
        <HeaderAdmin
          onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

      {/* CABEÇALHO */}
      <div className="admin-page-heading">

        <div>
          <p className="eyebrow">
            Catálogo
          </p>

          <h1>
            {existing
              ? 'Editar artigo'
              : 'Novo artigo'}
          </h1>

          <p>
            Preencha os dados que serão
            apresentados na loja.
          </p>
        </div>


        <Link to="/admin/produtos">

          <Button variant="secondary">
            Cancelar
          </Button>

        </Link>

      </div>


      <form
        className="product-editor"
        onSubmit={submit}
      >

        {/* COLUNA PRINCIPAL */}
        <div className="product-editor__main">

          <section className="admin-card form-card-admin">

            <h2>
              Informação principal
            </h2>


            <div className="form-grid">

              <label className="field field--wide">

                <span>
                  Nome do artigo *
                </span>

                <input
                  name="name"
                  value={form.name}
                  onChange={update}
                  placeholder="Ex.: Repelente de Insectos 500ml"
                />

              </label>


              <label className="field">

                <span>
                  Categoria *
                </span>

                <select
                  name="category"
                  value={form.category}
                  onChange={update}
                >
                  {categories.map(
                    (category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    ),
                  )}
                </select>

              </label>


              <label className="field">

                <span>
                  Stock *
                </span>

                <input
                  type="number"
                  min="0"
                  step="1"
                  name="stock"
                  value={form.stock}
                  onChange={update}
                />

              </label>


              <label className="field">

                <span>
                  Preço actual (MT) *
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  name="price"
                  value={form.price}
                  onChange={update}
                />

              </label>


              <label className="field">

                <span>
                  Preço anterior (MT)
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  name="oldPrice"
                  value={form.oldPrice}
                  onChange={update}
                />

              </label>


              <label className="field field--wide">

                <span>
                  Descrição *
                </span>

                <textarea
                  rows="6"
                  name="description"
                  value={form.description}
                  onChange={update}
                  placeholder="Descreva o material, utilidade, acabamento e medidas principais."
                />

              </label>


              <label className="field field--wide">

                <span>
                  Características — uma por linha
                </span>

                <textarea
                  rows="5"
                  name="featuresText"
                  value={form.featuresText}
                  onChange={update}
                  placeholder={
                    'Estrutura resistente\nFácil de limpar\nAcabamento seguro'
                  }
                />

              </label>

            </div>

          </section>


          {/* VISIBILIDADE */}
          <section className="admin-card form-card-admin">

            <h2>
              Visibilidade
            </h2>


            <label className="check-row">

              <input
                type="checkbox"
                name="active"
                checked={Boolean(form.active)}
                onChange={update}
              />

              <span>
                <strong>
                  Produto activo
                </strong>

                <small>
                  Será apresentado no catálogo público.
                </small>
              </span>

            </label>


            <label className="check-row">

              <input
                type="checkbox"
                name="featured"
                checked={Boolean(form.featured)}
                onChange={update}
              />

              <span>
                <strong>
                  Produto em destaque
                </strong>

                <small>
                  Pode aparecer na página inicial.
                </small>
              </span>

            </label>


            <label className="check-row">

              <input
                type="checkbox"
                name="notifyCustomers"
                checked={
                  Boolean(
                    form.notifyCustomers,
                  )
                }
                onChange={update}
              />

              <span>
                <strong>
                  Notificar clientes por e-mail
                </strong>

                <small>
                  Apenas clientes compradores que
                  aceitaram receber novidades.
                </small>
              </span>

            </label>

          </section>

        </div>


        {/* COLUNA LATERAL */}
        <aside className="product-editor__side">

          <section className="admin-card form-card-admin">

            <h2>
              Imagem do artigo
            </h2>


            <div className="image-upload-preview">

              <img
                src={
                  form.image ||
                  createProductPlaceholder(
                    form.name ||
                    'Novo artigo',
                  )
                }
                alt="Pré-visualização"
                decoding="async"
                width="600"
                height="450"
              />

            </div>


            <label className="upload-button">

              <input
                type="file"
                accept="
                  image/jpeg,
                  image/png,
                  image/webp
                "
                onChange={handleImage}
                disabled={processingImage}
              />

              {processingImage
                ? 'A optimizar imagem...'
                : 'Escolher imagem'}

            </label>


            <p className="muted">
              JPG, PNG ou WEBP. A fotografia será
              automaticamente optimizada para o website.
            </p>


            {imageError && (
              <div className="alert alert--error">
                {imageError}
              </div>
            )}

          </section>


          {error && (
            <div className="alert alert--error">
              {error}
            </div>
          )}


          <Button
            type="submit"
            size="lg"
            className="full-width"
            disabled={
              saving ||
              processingImage
            }
          >
            {saving
              ? 'A guardar...'
              : processingImage
                ? 'A optimizar imagem...'
                : 'Guardar artigo'}
          </Button>

        </aside>

      </form>

      </div>
    </div>
  );
}