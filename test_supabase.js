const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
    console.log('Testing News...');
    const { data: news, error: newsError } = await supabase.from('news').select('*');
    if (newsError) console.error('News Error:', newsError);
    else console.log('News Data Count:', news?.length, news);

    console.log('\nTesting News Detail query with slug "hkuhujh"...');
    const { data: detailBySlug, error: slugError } = await supabase
        .from('news')
        .select('*')
        .or('slug.eq.hkuhujh,id.eq.hkuhujh')
        .single();
    if (slugError) console.error('Slug Query Error:', slugError);
    else console.log('Slug Query Result:', detailBySlug);

    console.log('\nTesting Factory Photos...');
    const { data: photos, error: photosError } = await supabase.from('factory_photos').select('*');
    if (photosError) console.error('Photos Error:', photosError);
    else console.log('Photos Data Count:', photos?.length, photos);

    console.log('\nTesting Leads...');
    const { data: leads, error: leadsError } = await supabase.from('customer_leads').select('*');
    if (leadsError) console.error('Leads Error:', leadsError);
    else console.log('Leads Data Count:', leads?.length, leads);

    console.log('\nTesting Products...');
    const { data: products, error: productsError } = await supabase.from('products').select('*').limit(1);
    if (productsError) console.error('Products Error:', productsError);
    else console.log('Product Keys:', products?.[0] ? Object.keys(products[0]) : 'None', products?.[0]);
}

test();
