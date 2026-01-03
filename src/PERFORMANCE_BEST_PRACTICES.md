# ⚡ React Native Performance Best Practices

**Guide Version:** 1.0  
**Date:** January 2, 2026  
**Target:** Enterprise Mobile Apps

---

## 🎯 Quick Reference

### **Performance Checklist**

- [ ] Use React.memo for expensive child components
- [ ] Use useMemo for computed values
- [ ] Use useCallback for event handlers
- [ ] Memoize StyleSheet objects
- [ ] Use useNativeDriver for animations (when possible)
- [ ] Optimize FlatList with proper props
- [ ] Avoid inline styles and functions
- [ ] Remove console.logs in production

---

## 1️⃣ React.memo - Prevent Re-renders

### **When to Use**
✅ Components rendered in lists  
✅ Components with expensive rendering  
✅ Components that receive same props often  
✅ Child components of frequently updating parents

### **How to Use**

```tsx
// ✅ CORRECT
const ExpensiveChild = React.memo<Props>(({ data, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{data.label}</Text>
    </TouchableOpacity>
  );
});

ExpensiveChild.displayName = 'ExpensiveChild';

// ❌ WRONG - No memoization
const ExpensiveChild = ({ data, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{data.label}</Text>
    </TouchableOpacity>
  );
};
```

### **Example: List Item**

```tsx
// ✅ OPTIMIZED
const ListItem = React.memo<{
  item: Item;
  onPress: (id: string) => void;
}>(({ item, onPress }) => {
  const handlePress = useCallback(() => {
    onPress(item.id);
  }, [item.id, onPress]);

  return (
    <TouchableOpacity onPress={handlePress}>
      <Text>{item.label}</Text>
    </TouchableOpacity>
  );
});

ListItem.displayName = 'ListItem';
```

**Impact:** Reduces re-renders by **60-80%** in lists

---

## 2️⃣ useMemo - Cache Expensive Calculations

### **When to Use**
✅ Expensive calculations (filtering, sorting, mapping)  
✅ Object/array transformations  
✅ StyleSheet creation  
✅ Complex conditional logic

### **How to Use**

```tsx
// ✅ CORRECT - Memoize expensive calculation
const filteredItems = useMemo(() => {
  return items.filter(item => item.active)
               .sort((a, b) => a.name.localeCompare(b.name))
               .map(item => ({ ...item, formatted: true }));
}, [items]);

// ❌ WRONG - Recalculates on every render
const filteredItems = items
  .filter(item => item.active)
  .sort((a, b) => a.name.localeCompare(b.name))
  .map(item => ({ ...item, formatted: true }));
```

### **Example: Active Item Lookup**

```tsx
// ✅ OPTIMIZED
const activeItem = useMemo(
  () => items.find(item => item.id === activeId),
  [items, activeId]
);

// ❌ NOT OPTIMIZED
const activeItem = items.find(item => item.id === activeId);
```

### **Example: StyleSheet Memoization**

```tsx
// ✅ OPTIMIZED - Only recreates when theme changes
const styles = useMemo(() => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  text: {
    color: theme.colors.text,
  },
}), [theme]);

// ❌ NOT OPTIMIZED - Creates new StyleSheet every render
const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
  },
});
```

**Impact:** Saves **10-30ms** per render

---

## 3️⃣ useCallback - Stable Function References

### **When to Use**
✅ Functions passed to memoized children  
✅ Functions used in dependency arrays  
✅ Event handlers passed to lists  
✅ Functions passed to context

### **How to Use**

```tsx
// ✅ CORRECT
const handlePress = useCallback((id: string) => {
  navigation.navigate('Details', { id });
}, [navigation]);

// ❌ WRONG - New function every render
const handlePress = (id: string) => {
  navigation.navigate('Details', { id });
};
```

### **Example: List with Callbacks**

```tsx
// ✅ OPTIMIZED
const MyList: React.FC<Props> = ({ items, onSelect }) => {
  const handleSelect = useCallback((item: Item) => {
    onSelect(item.id);
  }, [onSelect]);

  const renderItem = useCallback(({ item }: { item: Item }) => (
    <ListItem item={item} onPress={handleSelect} />
  ), [handleSelect]);

  const keyExtractor = useCallback((item: Item) => item.id, []);

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
    />
  );
};
```

**Impact:** Prevents child re-renders, saves **5-15ms** per interaction

---

## 4️⃣ FlatList Optimizations

### **Essential Props**

```tsx
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={keyExtractor}
  
  // Performance optimizations
  removeClippedSubviews={true}      // ✅ Remove off-screen items
  maxToRenderPerBatch={10}          // ✅ Render 10 items per batch
  windowSize={5}                    // ✅ Render 5 screens worth
  initialNumToRender={10}           // ✅ Initial render count
  
  // UX improvements
  keyboardShouldPersistTaps="handled"
  showsVerticalScrollIndicator={false}
/>
```

### **Example: Optimized List**

```tsx
// ✅ FULLY OPTIMIZED
const OptimizedList: React.FC<Props> = ({ items, onSelect }) => {
  const renderItem = useCallback(({ item }: { item: Item }) => (
    <MemoizedListItem item={item} onPress={onSelect} />
  ), [onSelect]);

  const keyExtractor = useCallback((item: Item) => item.id, []);

  const ListEmptyComponent = useMemo(() => (
    <EmptyState message="No items" />
  ), []);

  const getItemLayout = useCallback((data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  }), []);

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListEmptyComponent={ListEmptyComponent}
      getItemLayout={getItemLayout}  // ✅ For fixed-height items
      removeClippedSubviews
      maxToRenderPerBatch={10}
      windowSize={5}
      initialNumToRender={10}
    />
  );
};
```

**Impact:** **70% faster** scrolling on large lists

---

## 5️⃣ Animation Optimizations

### **Use useNativeDriver When Possible**

```tsx
// ✅ CAN USE NATIVE DRIVER
// - opacity
// - transform (translateX, translateY, scale, rotate)

Animated.timing(animatedValue, {
  toValue: 1,
  duration: 300,
  useNativeDriver: true,  // ✅ 60fps guaranteed
}).start();

// ⚠️ CANNOT USE NATIVE DRIVER
// - width, height
// - top, left, right, bottom
// - backgroundColor, etc.

Animated.timing(animatedValue, {
  toValue: 100,
  duration: 300,
  useNativeDriver: false,  // ⚠️ Required for layout props
}).start();
```

### **Example: Fade In Animation**

```tsx
// ✅ OPTIMIZED - Uses native driver
const FadeIn: React.FC<Props> = ({ children }) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,  // ✅ Runs on UI thread
    }).start();
  }, []);

  return (
    <Animated.View style={{ opacity }}>
      {children}
    </Animated.View>
  );
};
```

**Impact:** Guaranteed **60fps** animations

---

## 6️⃣ Avoid Common Pitfalls

### **❌ Inline Styles**

```tsx
// ❌ WRONG - Creates new object every render
<View style={{ backgroundColor: 'red', padding: 10 }}>
  <Text>Hello</Text>
</View>

// ✅ CORRECT - Reuses style object
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'red',
    padding: 10,
  },
});

<View style={styles.container}>
  <Text>Hello</Text>
</View>
```

### **❌ Inline Functions**

```tsx
// ❌ WRONG - New function every render
<TouchableOpacity onPress={() => handlePress(item.id)}>
  <Text>Press</Text>
</TouchableOpacity>

// ✅ CORRECT - Stable reference
const handleItemPress = useCallback(() => {
  handlePress(item.id);
}, [item.id, handlePress]);

<TouchableOpacity onPress={handleItemPress}>
  <Text>Press</Text>
</TouchableOpacity>
```

### **❌ Anonymous Arrow Functions in Render**

```tsx
// ❌ WRONG
{items.map((item) => (
  <ListItem key={item.id} item={item} />
))}

// ✅ CORRECT
const renderItem = (item: Item) => (
  <ListItem key={item.id} item={item} />
);

{items.map(renderItem)}
```

---

## 7️⃣ Image Optimizations

### **Use Proper Image Components**

```tsx
// ✅ CORRECT - With Expo
import { Image } from 'expo-image';

<Image
  source={{ uri: imageUrl }}
  contentFit="cover"
  transition={300}
  cachePolicy="memory-disk"  // ✅ Cache images
/>

// ✅ CORRECT - With React Native
import FastImage from 'react-native-fast-image';

<FastImage
  source={{ uri: imageUrl }}
  resizeMode="cover"
  priority={FastImage.priority.normal}
/>
```

### **Optimize Image Sizes**

```tsx
// ✅ CORRECT - Proper sizing
<Image
  source={{ uri: imageUrl }}
  style={{ width: 100, height: 100 }}  // ✅ Explicit dimensions
/>

// ❌ WRONG - No dimensions
<Image source={{ uri: imageUrl }} />
```

---

## 8️⃣ Memory Management

### **Clean Up Effects**

```tsx
// ✅ CORRECT - Cleanup subscription
useEffect(() => {
  const subscription = Dimensions.addEventListener('change', handler);
  
  return () => subscription?.remove();  // ✅ Cleanup
}, []);

// ✅ CORRECT - Cleanup timer
useEffect(() => {
  const timer = setTimeout(() => {
    // Do something
  }, 1000);
  
  return () => clearTimeout(timer);  // ✅ Cleanup
}, []);
```

### **Avoid Memory Leaks**

```tsx
// ✅ CORRECT - Prevent state updates after unmount
useEffect(() => {
  let mounted = true;
  
  fetchData().then((data) => {
    if (mounted) {  // ✅ Check if still mounted
      setData(data);
    }
  });
  
  return () => {
    mounted = false;
  };
}, []);
```

---

## 9️⃣ Bundle Size Optimization

### **Import Only What You Need**

```tsx
// ❌ WRONG - Imports entire library
import _ from 'lodash';
const sorted = _.sortBy(items, 'name');

// ✅ CORRECT - Import specific function
import sortBy from 'lodash/sortBy';
const sorted = sortBy(items, 'name');

// ✅ BETTER - Use native methods
const sorted = items.sort((a, b) => a.name.localeCompare(b.name));
```

### **Lazy Load When Possible**

```tsx
// ✅ CORRECT - Lazy import for heavy components
const HeavyChart = React.lazy(() => import('./HeavyChart'));

<Suspense fallback={<Skeleton />}>
  <HeavyChart data={data} />
</Suspense>
```

---

## 🔟 Production Optimizations

### **Remove Console Logs**

```tsx
// ✅ CORRECT - Remove in production
if (__DEV__) {
  console.log('Debug info:', data);
}

// ❌ WRONG - Logs in production
console.log('User data:', userData);
```

### **Enable Hermes**

```json
// app.json
{
  "expo": {
    "jsEngine": "hermes",  // ✅ Faster JS engine
    "android": {
      "enableProguard": true,  // ✅ Code minification
      "enableShrinkResources": true
    }
  }
}
```

---

## 📊 Performance Monitoring

### **Add Performance Metrics**

```tsx
import { PerformanceObserver, performance } from 'react-native-performance';

// Track component render time
const MyComponent = () => {
  useEffect(() => {
    const mark = performance.mark('MyComponent-render');
    
    return () => {
      performance.measure('MyComponent', mark);
    };
  }, []);
  
  return <View>...</View>;
};
```

### **Monitor with Flipper**

```bash
# Install Flipper plugins
npm install --save-dev react-native-flipper

# Use Flipper to monitor:
# - Network requests
# - Layout performance
# - Memory usage
# - Logs
```

---

## ✅ Performance Checklist

### **Before Every Commit**

- [ ] No console.logs in production code
- [ ] No inline styles in render
- [ ] No inline functions in props
- [ ] StyleSheet.create used for all styles
- [ ] Lists use FlatList with optimizations
- [ ] Expensive components use React.memo
- [ ] Expensive calculations use useMemo
- [ ] Event handlers use useCallback
- [ ] Animations use useNativeDriver (when possible)
- [ ] Images have explicit dimensions
- [ ] Effects have cleanup functions
- [ ] No unnecessary re-renders

### **Before Every Release**

- [ ] Test on low-end devices
- [ ] Profile with React DevTools
- [ ] Check bundle size
- [ ] Enable Hermes
- [ ] Remove debug code
- [ ] Test memory leaks
- [ ] Verify 60fps animations
- [ ] Test with 1000+ items in lists

---

## 🎯 Quick Wins

### **Top 5 Easiest Optimizations**

1. **Add React.memo to list items** - 5 minutes, 60% faster lists
2. **Enable useNativeDriver** - 2 minutes, 60fps guaranteed
3. **Add FlatList optimizations** - 3 minutes, 70% faster scrolling
4. **Memoize StyleSheet** - 5 minutes, 5ms saved per render
5. **Remove console.logs** - 2 minutes, cleaner production code

**Total Time:** ~17 minutes  
**Total Impact:** Huge ⚡

---

## 📚 Resources

### **Official Docs**
- [React Native Performance](https://reactnative.dev/docs/performance)
- [React Optimization](https://react.dev/learn/render-and-commit)
- [Expo Performance](https://docs.expo.dev/guides/performance/)

### **Tools**
- [React DevTools Profiler](https://react.dev/learn/react-developer-tools)
- [Flipper](https://fbflipper.com/)
- [Why Did You Render](https://github.com/welldone-software/why-did-you-render)

### **Benchmarking**
- [Reassure](https://github.com/callstack/reassure)
- [Flashlight](https://github.com/bamlab/flashlight)

---

## 🎉 Summary

### **Golden Rules**

1. **Measure First** - Profile before optimizing
2. **Start with Big Wins** - React.memo + FlatList
3. **Use Native Driver** - For 60fps animations
4. **Memoize Wisely** - Don't over-optimize
5. **Test on Real Devices** - Especially low-end

### **Expected Results**

Following these practices should give you:
- ⚡ **40-60%** faster renders
- ⚡ **60fps** smooth animations
- ⚡ **70%** faster list scrolling
- ⚡ **30%** less memory usage
- ⚡ **Better** battery life

---

**Created By:** Performance Engineering Team  
**Last Updated:** January 2, 2026  
**Version:** 1.0
